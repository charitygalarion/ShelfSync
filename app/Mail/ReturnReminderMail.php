<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Borrow;

class ReturnReminderMail extends Mailable
{
    use Queueable, SerializesModels;
    public $borrow;
    public function __construct(Borrow $borrow){ $this->borrow = $borrow; }
    public function build(){ return $this->subject('Library Return Reminder')->view('emails.return_reminder'); }
}
