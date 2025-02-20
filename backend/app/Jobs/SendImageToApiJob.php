<?php

namespace App\Jobs;

use App\Models\Photo;
use App\Models\User;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendImageToApiJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 25;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 3;

    protected $photo;
    protected $userId;
    protected $userPhone;
    /**
     * Create a new job instance.
     */
    public function __construct(Photo $photo, $userId, $userPhone)
    {
        $this->photo = $photo;
        $this->userId = $userId;
        $this->userPhone = $userPhone;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $client = new Client();
        
        // recupera o token para conseguir comunicação com a api
        $apiKey = env('API_TOKEN');

        //validação para pegar o user
        $user = User::find($this->userId);
        if (!$user) {
            Log::error("Usuário não encontrado para a foto ID: {$this->photo->id}");
            return;
        }
        
        try {

            $response = $client->request('POST', 'https://moderacao.bizsys.com.br/api/media_insert', [
                'headers' => [
                    'Authorization' => "Bearer $apiKey",
                    'Accept' => 'application/json',
                ],
                'multipart' => [
                    [
                        'name' => 'text',
                        'contents' => 'text', // string
                    ],
                    [
                        'name' => 'identification',
                        'contents' => '00000000000', // CPF
                    ],
                    [
                        'name' => 'phone',
                        'contents' => $this->userPhone,
                    ],
                    [
                        'name' => 'fk_id_client',
                        'contents' => 1,
                    ],
                    [
                        'name' => 'fk_id_campain',
                        'contents' => 14,
                    ],
                    [
                        'name' => 'fk_id_media_type',
                        'contents' => 1, // Aqui é 1 para foto
                    ],
                    [
                        'name' => 'participation',
                        'contents' => now('America/Sao_Paulo'), // Data formatada corretamente
                    ],
                    [
                        'name' => 'send_override',
                        'contents' => 0,
                    ],
                    [
                        'name' => 'file',
                        'contents' => fopen(public_path($this->photo->name_photo), 'r'),
                        'filename' => basename($this->photo->name_photo),
                    ],
                ],
            ]);

            //pega a responsta da api
            $result = json_decode($response->getBody(), true);

            //validação para resposta da api 
            if ($result['success'] == true) {
                $this->photo->update(['send' => 1]);
            } else {
                Log::error("Erro no envio da imagem ID {$this->photo->id}: " . json_encode($result));
            }
        } catch (Exception $e) {

            Log::error('Erro ao enviar imagem para API: ' . $e->getMessage());
        }
    }
}