from rest_framework import permissions


class IsAuthenticatedForDataAccess(permissions.IsAuthenticated):
    """Shared permission hook for authenticated financial data access."""

    pass
