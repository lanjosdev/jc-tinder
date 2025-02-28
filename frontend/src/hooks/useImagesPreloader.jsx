// Hooks / Libs:
import { useState, useEffect } from 'react';


export function useImagesPreloader(srcList) {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    // States caso queira ver o progresso de carregamento de imagens
    // const [loadedCount, setLoadedCount] = useState(0);
    // setLoadedCount(prev => prev + 1);

    useEffect(()=> {
        let loadedImages = 0;
        const totalImages = srcList.length;
        
        const preloadImages = ()=> {
            srcList.forEach((srcEach)=> {
                const img = new Image();
                img.src = srcEach;

                img.onload = ()=> {
                    loadedImages++;
                    if(loadedImages == totalImages) {
                        setImagesPreloaded(true);
                    }
                };
                // img.onerror = ()=> {
                //     // Tratar com states de error
                // };
            });

            // Tratamento de erro
            if(loadedImages != totalImages) {
                setHasError(true);
            }
            console.log('fim loop')
        };        
        preloadImages();

        console.log('FIM HOOK: useImagesPreloader')
    }, [srcList]);
    

    

    return {
        imagesPreloaded,
        hasError
    }
}


// Uso:
// const { imagesPreloaded } = useImagePreloader(['imagem.jpg']);