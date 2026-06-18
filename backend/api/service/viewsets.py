from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response


class ProtectedDeleteMixin:
    protected_delete_message = 'Este registo tem dados associados e nao pode ser eliminado.'

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': self.protected_delete_message},
                status=status.HTTP_409_CONFLICT,
            )
