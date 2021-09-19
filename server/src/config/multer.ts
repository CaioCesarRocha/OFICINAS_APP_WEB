import multer from 'multer';
import path from 'path'; //resolver o problema de caminhos em SO diferentes
import crypto from 'crypto'; //gerar um hash aleatorio de dados

export default{
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),//aonde os arquivos vao parar quando subidos
        filename(request, file, callback) {
            const hash = crypto.randomBytes(6).toString('hex'); // tamanho 6, sendo convertido para hexadecimal

            const fileName = `${hash}-${file.originalname}`; //mescla o hash com o nome, para ainda identificar o arquivo

            callback(null, fileName);
        }     
    }),
};