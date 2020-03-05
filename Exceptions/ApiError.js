export function Error(message, status) {
    this.message = message;
    this.status = status;
}

export function ServiceUnavailable(message = 'Service Unavailable', status = 503) {
    this.message = message;
    this.status = status;
}

export function SessionExpired(message = 'Session Expired', status = 401) {
    this.message = message;
    this.status = status;
}

export function NotFound(message = 'Not Found', status = 404) {
    this.message = message;
    this.status = status;
}