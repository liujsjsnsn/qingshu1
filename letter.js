// 获取DOM元素
const heart = document.querySelector('.heart');
const card = document.querySelector('.card');
const box = document.querySelector('#box');

// 检查元素是否存在
if (!heart || !card || !box) {
    console.error('必要的DOM元素未找到');
}

// 音频播放函数
function playAudio() {
    try {
        // 检查是否已有音频实例，如果没有则创建新的
        if (typeof window.audioInstance === 'undefined') {
            window.audioInstance = new Audio('qlx.mp3');
            window.audioInstance.volume = 0.7; // 设置音量
            window.audioInstance.loop = false; // 防止循环播放
            
            // 预加载音频
            window.audioInstance.preload = 'auto';
        }
        
        // 尝试播放音频
        const playPromise = window.audioInstance.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 播放成功
                console.log('音频播放成功');
            }).catch(error => {
                console.warn('音频播放失败，可能需要用户手势:', error);
                
                // 在移动设备上，可能需要用户交互才能播放音频
                // 重新尝试播放
                setTimeout(() => {
                    if (window.audioInstance) {
                        window.audioInstance.currentTime = 0; // 重置到开头
                        window.audioInstance.play().then(() => {
                            console.log('音频播放成功');
                        }).catch(err => {
                            console.warn('重试音频播放也失败:', err);
                            
                            // 尝试在用户交互后播放
                            const tryPlayOnInteraction = () => {
                                if (window.audioInstance) {
                                    window.audioInstance.currentTime = 0; // 重置到开头
                                    window.audioInstance.play().then(() => {
                                        document.removeEventListener('touchstart', tryPlayOnInteraction);
                                        document.removeEventListener('click', tryPlayOnInteraction);
                                    }).catch(retryErr => {
                                        console.warn('即使在交互后也无法播放音频:', retryErr);
                                    });
                                }
                            };
                            
                            // 监听后续的用户交互
                            document.addEventListener('touchstart', tryPlayOnInteraction);
                            document.addEventListener('click', tryPlayOnInteraction);
                        });
                    }
                }, 100);
            });
        }
    } catch (error) {
        console.warn('音频初始化失败:', error);
    }
}

// 打字效果函数
function startTypingEffect() {
    let i = 0;
    const str = '亲爱的君君：见字如晤。我好像很久没有跟你写信了，今天这么一看，似乎还是写信最浪漫。不知不觉我们已经携手走过了五个年头，这五年是我最开心的五年。因为有了你，我的人生似乎都变了样。我曾经也敏感多疑，喜欢自己胡思乱想，也非常在意别人的话，但是自从遇见了你，我突然感觉到这似乎都不是什么大不了的事情，因为我知道无论怎样总会有一个人陪着我，我以后永远不会是孤单的一个人。我不敢和别人说的话可以说给你听，可以对你哭，对你笑，在你面前我可以像小孩子一样无忧无虑。我也不知道从什么时候开始我就已经离不开你了，我感觉我的心，我的灵魂都已经在你那里了。我也试过想象失去你的生活，结果我发现我根本活不下去，那样的生活绝不是我想要的。我在这个特殊的日子冒昧地邀请你，可以陪我度过下一个五年，下下个五年，以及以后所有的五年吗？我发誓我将会用我的生命去爱你，直到海枯石烂。最后，我还要对你说，刘丽君，我爱你！';
    let strp = '';
    
    // 修复打字效果bug：使用更精确的定时器控制
    function print() {
        if (i >= str.length) {
            // 清除光标闪烁效果
            box.innerHTML = strp;
            return;
        }
        
        if(str[i] === '<') {
            strp += "<br><br>";
            box.innerHTML = strp + '|';
        } else {
            strp += str[i];
            box.innerHTML = strp + '|';
        }
        
        i++;
    }
    
    // 使用更稳定的定时器
    setTimeout(() => {
        const printInterval = setInterval(() => {
            print();
            if(i >= str.length) {
                clearInterval(printInterval);
            }
        }, 150); // 调整为150毫秒，更流畅
    }, 5500);
}

// 背景显示函数
function appearBackground() {
    setTimeout(() => {
        box.style.opacity = '1';
        box.style.zIndex = '100';
    }, 1500);
}

// 主要点击事件处理
heart.addEventListener('click', function() {
    try {
        // 添加点击反馈
        this.style.transform = 'rotate(45deg) translateX(-70%) scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'rotate(45deg) translateX(-70%)';
        }, 100);
        
        // 淡出卡片
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        
        // 播放音频
        playAudio();
        
        // 启动打字效果
        startTypingEffect();
        
        // 显示背景
        appearBackground();
        
    } catch (error) {
        console.error('点击事件处理出错:', error);
    }
});

// 添加键盘支持
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        heart.click();
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('情书页面加载完成');
    
    // 预加载音频
    if (typeof window.audioInstance === 'undefined') {
        window.audioInstance = new Audio('qlx.mp3');
        window.audioInstance.preload = 'auto';
        window.audioInstance.load();
    }

});

