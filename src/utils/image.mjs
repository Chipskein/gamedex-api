import path from 'path';
import multer from 'multer';
const multer_config={
    dest:`${path.resolve()}/tmp`
}
export const upload=multer(multer_config);

