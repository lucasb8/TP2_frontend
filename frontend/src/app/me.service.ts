import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth$LoginParams } from '@backend/routes/auth/post.login.interfaces';
import User from '@backend/models/user';

@Injectable({
  providedIn: 'root'
})

export class MeService {
  /**
   * Cache the resolve() output.
   * 'undefined' means the cache is empty (default value).
   * 'null' means the user is not logged in.
   */
  private me: User | null | undefined;

  constructor (private httpClient: HttpClient) {}

  /**
   * On first call, retrieve the current user identity on /api/users/me.
   * On following calls, use a cached reference (this.me).
   * Returns Promise<User> if logged.
   * Returns Promise<null> otherwise.
   */
  async resolve () {
    if (typeof this.me !== 'undefined') return this.me;

    try {
      this.me = await this.httpClient.get('/api/users/me').toPromise() as User;
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 403) this.me = null;
      else throw err;
    }

    return this.me;
  }

  /**
   * Sends credentials against /auth/login.
   * Throws HttpErrorResponse in case of failure.
   * Returns Promise<void> if success.
   */
  async login (credentials: Auth$LoginParams) {
    await this.httpClient.post('/auth/login', credentials).toPromise();
    this.me = undefined; // reset cache
  }

  /**
   * Throws HttpErrorResponse in case of failure.
   * Returns Promise<void> if success.
   */
  async logout () {
    await this.httpClient.delete('/auth/logout').toPromise();
    this.me = undefined; // reset cache
  }
}