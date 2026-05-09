<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function build(): self
    {
        return $this->subject('Test Mailtrap')
            ->html('<h1>Mailtrap configurado correctamente</h1><p>Si ves esto, funciona.</p>');
    }
}
