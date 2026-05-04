<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido al Club</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1a1d23; padding: 30px 40px; text-align: center;">
                            <h1 style="color: #facc15; margin: 0; font-size: 24px;">ClubManager360</h1>
                            <p style="color: #9ca3af; margin: 8px 0 0; font-size: 14px;">Club Social &amp; Deportivo</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 22px;">¡Bienvenido, {{ $nombre }}!</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                                Tu registro como socio ha sido completado exitosamente. Para acceder a nuestra plataforma, 
                                necesitamos que crees tu contraseña personal.
                            </p>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
                                Haz clic en el siguiente botón para configurar tu acceso:
                            </p>

                            <!-- Button -->
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color: #facc15; border-radius: 6px; text-align: center;">
                                        <a href="{{ $setPasswordUrl }}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; text-decoration: none; font-weight: bold; font-size: 16px;">
                                            Crear mi contraseña
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 32px 0 0;">
                                Si no realizaste este registro, puedes ignorar este correo. Este enlace es de un solo uso 
                                y expirará después de ser utilizado.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                &copy; {{ date('Y') }} ClubManager360. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
