// Hooks / Libs:
import { useState, useEffect } from 'react';


export function useImagesPreloader(srcList) {
    const [imagesPreloaded, setImagesPreloaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    // States caso queira ver o progresso de carregamento de imagens
    // const [loadedCount, setLoadedCount] = useState(0);
    // setLoadedCount(prev => prev + 1);

    useEffect(()=> {
        console.log('Effect Hook useImagesPreloader');
        ////console.log(srcList);


        let loadedImages = 0;
        const totalImages = srcList.length;
        if(totalImages <= 0) {
            setHasError(true);
            return;
        }

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
                img.onerror = ()=> {
                    setHasError(true);
                };
            });
        };
        preloadImages();



        //// console.log('FIM HOOK: useImagesPreloader')
    }, [srcList]);
    

    

    return {
        imagesPreloaded,
        hasError
    }
}


// Uso:
// const { imagesPreloaded } = useImagePreloader(['imagem.jpg']);