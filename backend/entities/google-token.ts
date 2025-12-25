export interface GoogleToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGoogleTokenInput {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}

export interface UpdateGoogleTokenInput {
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
}

