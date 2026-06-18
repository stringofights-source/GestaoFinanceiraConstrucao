from rest_framework import permissions


class IsAuthenticatedForWriteOrReadOnly(permissions.IsAuthenticated):
    """Shared permission hook for future tenant and object-level rules."""

    pass
