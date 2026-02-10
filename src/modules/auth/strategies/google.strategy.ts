import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleUser } from '../dto/google-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<GoogleUser> {
    const { name, emails, id } = profile;
    const user: GoogleUser = {
      email: emails && emails[0] ? emails[0].value : '',
      firstName: name ? name.givenName : '',
      lastName: name ? name.familyName : '',
      accessToken,
      providerId: id,
    };

    return user;
  }
}
