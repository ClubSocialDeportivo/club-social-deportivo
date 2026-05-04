<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeSocio extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;
    public $nombre;
    public $frontendUrl;

    public function __construct(string $token, string $email, string $nombre)
    {
        $this->token = $token;
        $this->email = $email;
        $this->nombre = $nombre;
        $this->frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
    }

    public function build(): self
    {
        $setPasswordUrl = "{$this->frontendUrl}/set-password?token={$this->token}&email=" . urlencode($this->email);

        return $this->subject('Bienvenido al Club - Crea tu contraseña')
            ->view('emails.welcome-socio')
            ->with([
                'nombre' => $this->nombre,
                'setPasswordUrl' => $setPasswordUrl,
            ]);
    }
}
