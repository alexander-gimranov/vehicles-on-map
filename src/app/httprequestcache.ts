import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable()

export class HttpRequestCache  {

  cache = new Map();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    if (Date.now() - cached.lastRead > cached.maxAge) // expired
    {
      this.cache.delete(url);
      return undefined;
    }
    return cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>, maxAge: number): void {
    const url = req.urlWithParams;
    const entry = { url, response, lastRead: Date.now(), maxAge: maxAge};

    this.cache.forEach(expiredEntry => {
      if (Date.now() - expiredEntry.lastRead > expiredEntry.maxAge) {
        this.cache.delete(expiredEntry.url);
      }
    });

    this.cache.set(url, entry);
  }
}