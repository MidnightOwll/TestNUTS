let i=0;
let preview = document.querySelector('.preview'),
    arrows = preview.querySelector('.preview__btn'),
    navigation = preview.querySelector('.preview__position'),
    navigationPointer = navigation.children[0],
    prev = arrows.children[0],
    next = arrows.children[1],
    previewBody = preview.querySelector('.preview__body'),    
    previewItems = previewBody.querySelector('.preview__items'),    
    items = previewBody.querySelectorAll('.preview__item'),    
    previewAllWidth = previewBody.scrollWidth,
    itemWidth = items[0].offsetWidth + 40,
    itemIndex = 0,
    posInit = 0,
    posX1 = 0,
    posX2 = 0,
    posFinal = 0,
    end = 0,
    posThreshold = itemWidth * .5,
    trfRegExp = /[-0-9.]+(?=px)/,
    previewWidth = () => previewBody.offsetWidth,
    itemsEndCalc = function(){
        let prwWdh = previewWidth();
        end = items.length - Math.ceil(prwWdh/itemWidth);
    },
    pointerWidthCalc = function() {
        navigationPointer.style.width = `${navigation.offsetWidth/(end+1)}px`;
    } 
    itemMotion = function() {
        if(itemIndex > end){
            itemIndex = 0;
        } else if (itemIndex < 0){
            itemIndex = end;
        }

        previewItems.style.transition = 'transform .5s';
        previewItems.style.transform = `translate3d(-${itemIndex * itemWidth}px, 0px, 0px)`;
        navigationPointer.style.transition = 'transform .5s';
        navigationPointer.style.transform = `translate3d(${itemIndex*100}%, 0px, 0px)`;
    },
    getEvent = () => event.type.search('touch') !== -1 ? event.touches[0] : event,
    swipeStart = function() {
        let evt = getEvent()
        posInit = posX1 = evt.clientX;    
        previewItems.style.transition = '';    

        document.addEventListener('touchmove', swipeAction);
        document.addEventListener('touchend', swipeEnd);
        document.addEventListener('mousemove', swipeAction);
        document.addEventListener('mouseup', swipeEnd);
    },
    swipeAction = function() {
        let evt = getEvent(),
        styleT =  previewItems.style.transform,
        transform = +styleT.match(trfRegExp)[0];
        

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        previewItems.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
        
    },
    swipeEnd = function() {
        posFinal = posInit - posX1;
        let posItem = Math.ceil(Math.abs(posFinal)/itemWidth);       
      
        document.removeEventListener('touchmove', swipeAction);
        document.removeEventListener('mousemove', swipeAction);
        document.removeEventListener('touchend', swipeEnd);
        document.removeEventListener('mouseup', swipeEnd);

        if (Math.abs(posFinal) > posThreshold) {
            if (posInit < posX1) {
                itemIndex -= posItem;
                if(itemIndex < 0)itemIndex=0;
            } else if (posInit > posX1) {
                itemIndex += posItem;
                if(itemIndex > end)itemIndex=end;
            }
        }
        console.log(itemIndex);
        if (posInit !== posX1) {
            itemMotion();
        }
    }
    arrows.addEventListener('click', function() {
        let target = event.target;

        if (target === next) {
            if (itemIndex >= end){
                itemIndex = 0;
            } else {
                itemIndex++;
            }            
            } else if (target === prev) {
            if(itemIndex <= 0){
                itemIndex = end;
            } else {
                itemIndex--;
            }            
            } else {
            return;
            }
        itemMotion();
    });

    animationTime = function(){
        itemIndex++
        itemMotion();
    }
    document.addEventListener("DOMContentLoaded", itemsEndCalc);
    document.addEventListener("DOMContentLoaded", pointerWidthCalc);
    previewItems.style.transform = 'translate3d(0px, 0px, 0px)';      
    previewBody.addEventListener('touchstart', swipeStart);
    previewBody.addEventListener('mousedown', swipeStart);
    setInterval(animationTime,4000);

      

      