import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { appConstants } from './shared/app-constants';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: appConstants.jwtSecret,
      signOptions: {expiresIn: '1d'}
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
