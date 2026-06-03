import { Request, Response, NextFunction } from 'express';
import { KycSubmission } from '../models/KycSubmission';
import { Tenant } from '../models/Tenant';
import { deleteCache } from '../config/redis';
import { sendSuccess, sendCreated, sendError } from '../utils/response.util';

export class KycController {
  static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantId!;
      const existing = await KycSubmission.findOne({ where: { tenantId } });

      if (existing && existing.status === 'pending' || existing?.status === 'under_review' || existing?.status === 'approved') {
        sendError(res, `KYC is already ${existing.status}`, 409);
        return;
      }

      const kycData = {
        tenantId,
        businessName: req.body.businessName,
        businessType: req.body.businessType,
        registrationNumber: req.body.registrationNumber,
        taxNumber: req.body.taxNumber,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postalCode: req.body.postalCode,
        phone: req.body.phone,
        website: req.body.website,
        status: 'pending' as const,
        rejectionReason: undefined,
      };

      const kyc = existing
        ? await existing.update(kycData)
        : await KycSubmission.create(kycData);

      await Tenant.update({ kycStatus: 'pending' }, { where: { id: tenantId } });
      await deleteCache(`tenant:${tenantId}`);

      sendCreated(res, kyc, 'KYC submitted successfully');
    } catch (err) { next(err); }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kyc = await KycSubmission.findOne({ where: { tenantId: req.tenantId! } });
      sendSuccess(res, kyc, 'KYC status retrieved');
    } catch (err) { next(err); }
  }

  static async review(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;
      const kyc = await KycSubmission.findByPk(id);
      if (!kyc) { sendError(res, 'KYC submission not found', 404); return; }

      await kyc.update({
        status,
        rejectionReason: rejectionReason || undefined,
        reviewedBy: req.user!.id,
        reviewedAt: new Date(),
      });

      await Tenant.update({ kycStatus: status }, { where: { id: kyc.tenantId } });
      await deleteCache(`tenant:${kyc.tenantId}`);

      sendSuccess(res, kyc, 'KYC reviewed');
    } catch (err) { next(err); }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const where = status ? { status } : {};
      const submissions = await KycSubmission.findAll({ where, order: [['createdAt', 'DESC']] });
      sendSuccess(res, submissions, 'KYC submissions retrieved');
    } catch (err) { next(err); }
  }
}
