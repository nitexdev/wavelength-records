class SecurityHeadersMiddleware:
    """
    Adds Content-Security-Policy and Permissions-Policy headers, which
    Django doesn't set by default (unlike X-Frame-Options, X-Content-Type-
    Options, and Referrer-Policy, which SecurityMiddleware already handles
    out of the box).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; "
            "frame-ancestors 'none';"
        )
        response["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response