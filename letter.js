// 获取DOM元素
const heart = document.querySelector('.heart');
const card = document.querySelector('.card');
const box = document.querySelector('#box');

// 检查元素是否存在
if (!heart || !card || !box) {
    console.error('必要的DOM元素未找到');
}

// 音频播放状态标志
let isAudioPlaying = false;
let audioInstance = null;

// 初始化音频（只在需要时创建）
function initAudio() {
    if (!audioInstance) {
        audioInstance = new Audio('qlx.mp3');
        audioInstance.volume = 0.7;
        audioInstance.loop = true; // 改为循环播放，让音乐持续
        
        // 添加音频错误处理
        audioInstance.addEventListener('error', (e) => {
            console.error('音频加载失败:', e);
        });
        
        // 音频结束时重新播放（备用方案）
        audioInstance.addEventListener('ended', () => {
            if (isAudioPlaying) {
                audioInstance.currentTime = 0;
                audioInstance.play().catch(e => console.log('重播失败'));
            }
        });
    }
    return audioInstance;
}

// 播放音频函数（优化版）
function playAudio() {
    try {
        const audio = initAudio();
        
        // 如果已经在播放，不要重复触发
        if (isAudioPlaying) {
            console.log('音频已在播放中');
            return;
        }
        
        // 重置到开头
        audio.currentTime = 0;
        
        // 播放音频
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isAudioPlaying = true;
                    console.log('音频播放成功，将持续播放');
                })
                .catch(error => {
                    console.warn('音频播放失败:', error);
                    isAudioPlaying = false;
                    
                    // 一次性设置用户交互监听
                    const playOnInteraction = function() {
                        if (!isAudioPlaying && audioInstance) {
                            audioInstance.currentTime = 0;
                            audioInstance.play()
                                .then(() => {
                                    isAudioPlaying = true;
                                    console.log('用户交互后播放成功');
                                })
                                .catch(e => console.warn('交互后仍失败:', e));
                        }
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('click', playOnInteraction);
                    };
                    
                    document.addEventListener('touchstart', playOnInteraction);
                    document.addEventListener('click', playOnInteraction);
                });
        }
    } catch (error) {
        console.warn('音频初始化失败:', error);
    }
}

// 打字效果函数
function startTypingEffect() {
    let i = 0;
    const str = '写信真是一件温柔的事，细腻的小心思就藏在横竖撇捺之中，像是一只温顺的小兽躲在情意绵绵的字里行间，被火漆封印起来，等着解封的那一刻窜出来，跳进启信人眼底的柔波里。你一眨眼，温驯的小鹿就跳动一下，柔软的暖风就轻拂一下，遥远的星星就闪烁一下，而我，却心动不止一下';
    
    // 修复打字效果bug：使用更精确的定时器控制
    function print() {
        if (i >= str.length) {
            // 清除光标闪烁效果
            box.innerHTML = str.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // 防止HTML注入
            return;
        }
        
        let displayText = str.substring(0, i + 1);
        // 将原始文本中的特殊字符显示为普通文本
        displayText = displayText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        box.innerHTML = displayText + '|';
        
        i++;
    }
    
    // 清空box内容
    box.innerHTML = '';
    
    // 使用更稳定的定时器
    setTimeout(() => {
        const printInterval = setInterval(() => {
            print();
            if(i >= str.length) {
                clearInterval(printInterval);
                // 移除光标
                setTimeout(() => {
                    box.innerHTML = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }, 500);
            }
        }, 120); // 调整速度
    }, 500);
}

// 背景显示函数
function appearBackground() {
    setTimeout(() => {
        box.style.opacity = '1';
        box.style.zIndex = '100';
    }, 1500);
}

// 主要点击事件处理
heart.addEventListener('click', function(e) {
    // 阻止事件冒泡和重复触发
    e.stopPropagation();
    
    // 如果已经触发过，不再重复执行（防止多次点击）
    if (this.disabled) return;
    this.disabled = true;
    
    try {
        // 添加点击反馈
        this.style.transform = 'rotate(45deg) translateX(-70%) scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'rotate(45deg) translateX(-70%)';
        }, 100);
        
        // 淡出卡片
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        
        // 播放音频
        playAudio();
        
        // 启动打字效果
        startTypingEffect();
        
        // 显示背景
        appearBackground();
        
    } catch (error) {
        console.error('点击事件处理出错:', error);
        this.disabled = false; // 出错时恢复点击能力
    }
});

// 添加键盘支持
document.addEventListener('keydown', function(event) {
    if ((event.code === 'Space' || event.code === 'Enter') && !heart.disabled) {
        event.preventDefault();
        heart.click();
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('情书页面加载完成');
    
    // 预加载音频但不播放
    initAudio();
    
    // 移除HTML中的全局音频激活脚本的干扰
    // （通过在JS中覆盖全局变量方式）
    window.audioInstance = audioInstance;
});
