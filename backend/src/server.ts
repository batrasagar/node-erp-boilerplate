import 'dotenv/config';
import app from './app';
import { sequelize } from './config/database';
import { redisClient } from './config/redis';
import logger from './utils/logger.util';

const PORT = parseInt(process.env.PORT || '3000', 10);

async function bootstrap() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }

    redisClient.connect()
      .then(() => logger.info('Redis connection established'))
      .catch((err) => logger.warn('Redis unavailable, continuing without cache:', err));

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  await sequelize.close();
  process.exit(0);
});

bootstrap();
