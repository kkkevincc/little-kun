// 全局变量管理
const app = {
    // 存储当前用户信息
    userInfo: null,
    // 当前选择的场景
    currentScene: '',
    // 当前用户提问
    currentQuestion: '',
    // 当前生成的启示
    currentRevelation: '',
    // 梅花易数相关参数
    plumBlossomData: {
        time: '',
        randomNumber: '000',
        event: ''
    },
    // 用于Demo的模拟openid
    demoOpenid: 'demo_openid_' + new Date().getTime(),
    // 本地存储键名
    STORAGE_KEYS: {
        USER_INFO: 'userInfo',
        LAST_QUESTION: 'lastQuestion',
        COLLECTIONS: 'collections'
    },
    
    // 初始化函数
    init() {
        this.initElements();
        this.initEvents();
        this.loadStoredData();
        this.checkLoginStatus();
        this.initUserInterface();
    },
    
    // 初始化DOM元素引用
    initElements() {
        // 模块元素
        this.splashModule = document.getElementById('splash');
        this.sceneModule = document.getElementById('scene');
        this.questionModule = document.getElementById('question');
        this.transitionModule = document.getElementById('transition');
        this.revelationModule = document.getElementById('revelation');
        this.mineModule = document.getElementById('mine');
        this.plumBlossomModule = document.getElementById('plumBlossom');
        
        // 启动模块元素
        this.loginError = this.splashModule.querySelector('.login-error');
        this.retryLoginBtn = document.getElementById('retryLogin');
        this.loadingArea = this.splashModule.querySelector('.loading-area');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // 场景选择模块元素
        this.sceneCards = document.querySelectorAll('.scene-card');
        
        // 提问模块元素
        this.questionInput = document.getElementById('questionInput');
        this.charCount = document.getElementById('charCount');
        this.errorTip = document.getElementById('errorTip');
        this.submitQuestionBtn = document.getElementById('submitQuestion');
        this.switchToPlumBlossomBtn = document.getElementById('switchToPlumBlossomBtn');
        
        // 过渡模块元素
        this.retrySection = this.transitionModule.querySelector('.retry-section');
        this.retryGenerateBtn = document.getElementById('retryGenerate');
        
        // 答案模块元素
        this.revelationText = document.getElementById('revelationText');
        this.collectBtn = document.getElementById('collectBtn');
        this.newQuestionBtn = document.getElementById('newQuestionBtn');
        this.knowledgeBtn = document.getElementById('knowledgeBtn');
        this.unlockBtn = document.getElementById('unlockBtn');
        
        // 个人中心模块元素
        this.userCenterBtn = document.getElementById('userCenterBtn');
        this.closeMineBtn = document.getElementById('closeMine');
        this.userAvatar = document.getElementById('userAvatar');
        this.userNickname = document.getElementById('userNickname');
        this.myCollections = document.getElementById('myCollections');
        this.myOrders = document.getElementById('myOrders');
        this.aboutProduct = document.getElementById('aboutProduct');
        this.collectionsContent = document.getElementById('collectionsContent');
        this.collectionsList = document.getElementById('collectionsList');
        
        // 梅花易数模块元素
        this.timeInput = document.getElementById('timeInput');
        this.getCurrentTimeBtn = document.getElementById('getCurrentTimeBtn');
        this.eventInput = document.getElementById('eventInput');
        this.eventCharCount = document.getElementById('eventCharCount');
        this.plumBlossomErrorTip = document.getElementById('plumBlossomErrorTip');
        this.submitPlumBlossomBtn = document.getElementById('submitPlumBlossomBtn');
        this.backToNormalQuestionBtn = document.getElementById('backToNormalQuestionBtn');
        this.generateRandomNumberBtn = document.getElementById('generateRandomNumberBtn');
        
        // 齿轮选择器元素
        this.hundredGear = document.getElementById('hundredGear');
        this.tenGear = document.getElementById('tenGear');
        this.unitGear = document.getElementById('unitGear');
        
        // 顶部用户界面元素
        this.quickActionsPanel = document.getElementById('quickActionsPanel');
        this.historyBtn = document.getElementById('historyBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.notificationBubble = document.getElementById('notificationBubble');
        this.notificationCount = document.getElementById('notificationCount');
    },
    
    // 初始化事件监听
    initEvents() {
        // 登录相关事件
        this.retryLoginBtn.addEventListener('click', () => this.wxLogin());
        
        // 场景选择相关事件
        this.sceneCards.forEach(card => {
            card.addEventListener('click', () => this.selectScene(card.dataset.scene));
        });
        
        // 提问相关事件
        this.questionInput.addEventListener('input', () => this.handleQuestionInput());
        this.submitQuestionBtn.addEventListener('click', () => this.submitQuestion());
        this.switchToPlumBlossomBtn.addEventListener('click', () => this.showPlumBlossomModule());
        
        // 过渡模块相关事件
        this.retryGenerateBtn.addEventListener('click', () => this.generateRevelation());
        
        // 答案模块相关事件
        this.collectBtn.addEventListener('click', () => this.toggleCollection());
        this.newQuestionBtn.addEventListener('click', () => this.goToSceneSelection());
        this.knowledgeBtn.addEventListener('click', () => this.showKnowledge());
        this.unlockBtn.addEventListener('click', () => this.showUnlockPrompt());
        
        // 个人中心相关事件
        this.closeMineBtn.addEventListener('click', () => this.hideMineModule());
        this.myCollections.addEventListener('click', () => this.showCollections());
        
        // 梅花易数相关事件
        this.getCurrentTimeBtn.addEventListener('click', () => this.setCurrentTime());
        this.eventInput.addEventListener('input', () => this.handleEventInput());
        this.submitPlumBlossomBtn.addEventListener('click', () => this.submitPlumBlossom());
        this.backToNormalQuestionBtn.addEventListener('click', () => this.showQuestionModule());
        this.generateRandomNumberBtn.addEventListener('click', () => this.generateRandomNumber());
        
        // 齿轮选择器事件
        this.setupGearSelectors();
        this.myOrders.addEventListener('click', () => this.showOrders());
        this.aboutProduct.addEventListener('click', () => this.showAbout());
        
        // 顶部用户界面事件
        this.userCenterBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            const isPanelVisible = this.quickActionsPanel.classList.contains('show');
            
            if (isPanelVisible) {
                this.hideQuickActionsPanel();
            } else {
                this.showQuickActionsPanel();
            }
        });
        this.historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showHistory();
        });
        this.helpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showHelp();
        });
    },
    
    // 检查登录状态
    checkLoginStatus() {
        // 显示加载进度条
        this.showLoadingProgress();
        
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            this.userInfo = JSON.parse(savedUserInfo);
            // 非首次登录，显示进度条动画然后显示场景选择模块
            this.animateLoadingProgress(() => {
                this.hideSplashModule();
                this.showSceneModule();
                this.updateUserInfoDisplay();
            });
        } else {
            // 首次登录，触发微信登录
            setTimeout(() => this.wxLogin(), 1000);
        }
    },
    
    // 模拟微信登录（实际项目中需要调用微信开放平台API）
    wxLogin() {
        this.loginError.style.display = 'none';
        
        // 显示加载进度条
        this.showLoadingProgress();
        
        // 模拟API调用
        setTimeout(() => {
            try {
                this.animateLoadingProgress(() => {
                    // 模拟微信登录成功，生成用户信息
                    this.userInfo = {
                        openid: this.demoOpenid,
                        nickname: '测试用户' + Math.floor(Math.random() * 1000),
                        avatar: 'assets/default-avatar.svg',
                        freeCount: 3
                    };
                    
                    // 保存用户信息到本地存储
                    this.saveUserInfoToStorage(this.userInfo);
                    
                    // 更新用户信息显示
                    this.updateUserInfoDisplay();
                    
                    // 隐藏启动模块，显示场景选择模块
                    this.hideSplashModule();
                    this.showSceneModule();
                });
                
            } catch (error) {
                console.error('微信登录失败:', error);
                
                // 隐藏加载进度条
                if (this.loadingArea) {
                    this.loadingArea.style.display = 'none';
                }
                
                this.loginError.style.display = 'block';
            }
        }, 1500);
    },
    
    // 更新用户信息显示
    updateUserInfoDisplay() {
        if (this.userInfo) {
            this.userAvatar.src = this.userInfo.avatar;
            this.userNickname.textContent = this.userInfo.nickname || '匿名用户';
        }
    },
    
    // 模块显示/隐藏方法
    hideSplashModule() {
        this.splashModule.style.display = 'none';
    },
    
    // 加载进度相关方法
    showLoadingProgress() {
        if (this.loadingArea) {
            this.loadingArea.classList.add('fade-in');
            this.loadingArea.style.display = 'block';
        }
    },
    
    animateLoadingProgress(callback) {
        if (!this.progressFill || !this.progressText) {
            // 如果没有进度条元素，直接执行回调
            if (callback) callback();
            return;
        }
        
        let progress = 0;
        const progressTexts = [
            '正在连接内心智慧...',
            '初始化用户状态...',
            '加载场景选项...',
            '准备就绪...'
        ];
        let textIndex = 0;
        
        // 更新进度文本
        const updateProgressText = () => {
            if (textIndex < progressTexts.length) {
                this.progressText.textContent = progressTexts[textIndex];
                textIndex++;
            }
        };
        
        // 初始显示
        updateProgressText();
        
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; // 每次增加5-20%
            
            if (progress >= 100) {
                progress = 100;
                this.progressFill.style.width = '100%';
                this.progressText.textContent = '准备就绪...';
                
                clearInterval(interval);
                
                // 延迟执行回调，让用户看到100%
                setTimeout(() => {
                    if (this.loadingArea) {
                        this.loadingArea.classList.add('fade-out');
                        setTimeout(() => {
                            this.loadingArea.style.display = 'none';
                            if (callback) callback();
                        }, 400);
                    } else if (callback) {
                        callback();
                    }
                }, 300);
                
                return;
            }
            
            this.progressFill.style.width = `${progress}%`;
            
            // 每隔25%更新一次文本
            if (progress >= 25 && progress < 50 && textIndex === 1) {
                updateProgressText();
            } else if (progress >= 50 && progress < 75 && textIndex === 2) {
                updateProgressText();
            } else if (progress >= 75 && progress < 100 && textIndex === 3) {
                updateProgressText();
            }
        }, 200); // 每200ms更新一次
    },
    
    showSceneModule() {
        this.sceneModule.style.display = 'flex';
    },
    
    hideSceneModule() {
        this.sceneModule.style.display = 'none';
    },
    
    showQuestionModule() {
        // 清理滑动检测事件监听器
        this.cleanupSlideDetection();
        
        // 重置过渡模块样式
        this.transitionModule.style.transform = 'translateY(0)';
        this.transitionModule.style.opacity = '1';
        this.transitionModule.style.transition = '';
        
        // 先隐藏所有模块，然后显示当前模块
        this.hideAllModules();
        
        // 设置当前模块层级
        this.questionModule.style.zIndex = '10';
        this.questionModule.style.display = 'flex';
    },
    
    hideQuestionModule() {
        this.questionModule.style.display = 'none';
    },
    
    showTransitionModule() {
        this.hideAllModules();
        this.transitionModule.style.zIndex = '20';
        this.transitionModule.style.display = 'flex';
        this.retrySection.style.display = 'none';
        
        // 如果是梅花易数，添加滑动检测
        if (this.currentQuestion && this.currentQuestion.startsWith('梅花易数预测')) {
            this.addSlideDetection();
        }
    },
    
    hideTransitionModule() {
        // 清理滑动检测事件监听器
        this.cleanupSlideDetection();
        
        // 重置过渡模块样式
        this.transitionModule.style.transform = 'translateY(0)';
        this.transitionModule.style.opacity = '1';
        this.transitionModule.style.transition = '';
        
        this.transitionModule.style.display = 'none';
    },
    
    showRevelationModule() {
        this.hideAllModules();
        this.revelationModule.style.zIndex = '15';
        this.revelationModule.style.display = 'flex';
    },
    
    hideRevelationModule() {
        this.revelationModule.style.display = 'none';
    },
    
    // 显示梅花易数模块
    showPlumBlossomModule() {
        this.hideAllModules();
        
        // 清理滑动检测事件监听器
        this.cleanupSlideDetection();
        
        // 重置过渡模块样式
        this.transitionModule.style.transform = 'translateY(0)';
        this.transitionModule.style.opacity = '1';
        this.transitionModule.style.transition = '';
        
        // 设置当前模块层级
        this.plumBlossomModule.style.zIndex = '10';
        this.plumBlossomModule.style.display = 'flex';
        // 设置当前时间为默认值
        this.setCurrentTime();
    },
    
    // 隐藏梅花易数模块
    hidePlumBlossomModule() {
        this.plumBlossomModule.style.display = 'none';
    },
    
    // 隐藏所有模块
    hideAllModules() {
        // 清理滑动检测事件监听器
        this.cleanupSlideDetection();
        
        // 隐藏所有模块
        this.splashModule.style.display = 'none';
        this.sceneModule.style.display = 'none';
        this.questionModule.style.display = 'none';
        this.transitionModule.style.display = 'none';
        this.revelationModule.style.display = 'none';
        this.mineModule.style.display = 'none';
        this.plumBlossomModule.style.display = 'none';
    },
    
    // 获取中国标准时间（CST，UTC+8）
    getChinaTime() {
        // 创建当前时间
        const now = new Date();
        
        // 转换为中国标准时间（UTC+8）
        // 使用 getTimezoneOffset() 获取当前时区与UTC的偏移量（分钟）
        const offsetMinutes = now.getTimezoneOffset() * -1; // 转换为正数
        const chinaOffset = 8 * 60; // 中国时区偏移量（分钟）
        
        // 计算时间差并应用中国时区
        const timeDiff = (chinaOffset - offsetMinutes) * 60 * 1000;
        const chinaTime = new Date(now.getTime() + timeDiff);
        
        return chinaTime;
    },
    
    // 设置当前时间（使用中国标准时间）
    setCurrentTime() {
        // 使用中国标准时间
        const chinaTime = this.getChinaTime();
        
        // 格式化时间
        const year = chinaTime.getFullYear();
        const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
        const day = String(chinaTime.getDate()).padStart(2, '0');
        const hours = String(chinaTime.getHours()).padStart(2, '0');
        const minutes = String(chinaTime.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        this.timeInput.value = formattedDate;
        this.plumBlossomData.time = formattedDate;
    },
    
    // 处理事件输入
    handleEventInput() {
        const text = this.eventInput.value;
        this.eventCharCount.textContent = `${text.length}/100`;
        this.plumBlossomData.event = text;
    },
    
    // 设置齿轮选择器
    setupGearSelectors() {
        const gears = [
            { gear: this.hundredGear, index: 0 },
            { gear: this.tenGear, index: 1 },
            { gear: this.unitGear, index: 2 }
        ];
        
        gears.forEach(({ gear, index }) => {
            // 添加点击事件
            gear.addEventListener('click', (event) => {
                // 阻止默认行为和事件冒泡，防止文本选择
                event.preventDefault();
                event.stopPropagation();
                
                // 清除任何可能存在的文本选择
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                if (document.selection) {
                    document.selection.empty();
                }
                
                // 获取当前数字
                const numberEl = gear.querySelector('.gear-number');
                const currentValue = parseInt(numberEl.textContent);
                const nextValue = (currentValue + 1) % 10;
                numberEl.textContent = nextValue;
                
                // 同时更新下方的数字显示
                const valueElements = ['hundredValue', 'tenValue', 'unitValue'];
                document.getElementById(valueElements[index]).textContent = nextValue;
                
                // 获取齿轮齿装饰元素
                const teethEl = gear.querySelector('.gear-teeth');
                
                // 计算旋转角度（每次点击旋转36度）
                const currentRotation = gear.dataset.rotation ? parseInt(gear.dataset.rotation) : 0;
                const newRotation = currentRotation + 36;
                gear.dataset.rotation = newRotation;
                
                // 旋转齿轮齿装饰（保持中心数字正向）
                teethEl.style.transform = `rotate(${newRotation}deg)`;
                
                // 更新随机数
                const parts = this.plumBlossomData.randomNumber.split('');
                parts[index] = nextValue;
                this.plumBlossomData.randomNumber = parts.join('');
            });
            
            // 添加防双击选择
            gear.addEventListener('mousedown', (event) => {
                event.preventDefault();
            });
            
            // 添加防拖拽选择
            gear.addEventListener('selectstart', (event) => {
                event.preventDefault();
                return false;
            });
        });
    },
    
    // 生成随机三位数
    generateRandomNumber() {
        const hundred = Math.floor(Math.random() * 10);
        const ten = Math.floor(Math.random() * 10);
        const unit = Math.floor(Math.random() * 10);
        
        // 更新齿轮数字显示
        this.hundredGear.querySelector('.gear-number').textContent = hundred;
        this.tenGear.querySelector('.gear-number').textContent = ten;
        this.unitGear.querySelector('.gear-number').textContent = unit;
        
        // 更新齿轮下方的数字显示
        document.getElementById('hundredValue').textContent = hundred;
        document.getElementById('tenValue').textContent = ten;
        document.getElementById('unitValue').textContent = unit;
        
        this.plumBlossomData.randomNumber = `${hundred}${ten}${unit}`;
        
        // 初始化齿轮旋转角度
        this.hundredGear.dataset.rotation = hundred * 36;
        this.tenGear.dataset.rotation = ten * 36;
        this.unitGear.dataset.rotation = unit * 36;
        
        // 应用初始旋转角度
        this.hundredGear.querySelector('.gear-teeth').style.transform = `rotate(${hundred * 36}deg)`;
        this.tenGear.querySelector('.gear-teeth').style.transform = `rotate(${ten * 36}deg)`;
        this.unitGear.querySelector('.gear-teeth').style.transform = `rotate(${unit * 36}deg)`;
    },
    
    // 提交梅花易数请求
    submitPlumBlossom() {
        // 验证输入
        if (!this.plumBlossomData.time) {
            this.plumBlossomErrorTip.textContent = '请选择预测时间';
            this.plumBlossomErrorTip.style.display = 'block';
            return;
        }
        
        if (!this.plumBlossomData.event.trim()) {
            this.plumBlossomErrorTip.textContent = '请输入预测事件';
            this.plumBlossomErrorTip.style.display = 'block';
            return;
        }
        
        this.plumBlossomErrorTip.style.display = 'none';
        
        // 保存当前问题（使用梅花易数格式）
        this.currentQuestion = `梅花易数预测：${this.plumBlossomData.event}`;
        
        // 显示过渡模块
        this.showTransitionModule();
        
        // 生成启示
        this.generateRevelation();
    },
    
    showMineModule() {
        this.mineModule.classList.add('show');
        this.collectionsContent.style.display = 'none';
    },
    
    hideMineModule() {
        this.mineModule.classList.remove('show');
    },
    
    // 场景选择处理
    selectScene(scene) {
        this.currentScene = scene;
        this.hideSceneModule();
        this.showQuestionModule();
    },
    
    // 处理提问输入
    handleQuestionInput() {
        const length = this.questionInput.value.length;
        this.charCount.textContent = `${length}/50`;
        
        if (length > 50) {
            this.charCount.style.color = '#f00';
            this.errorTip.textContent = '字数已超限';
            this.errorTip.style.display = 'block';
        } else {
            this.charCount.style.color = '#999';
            this.errorTip.style.display = 'none';
        }
    },
    
    // 提交提问
    submitQuestion() {
        const question = this.questionInput.value.trim();
        
        if (!question) {
            this.errorTip.textContent = '请写下你的困惑';
            this.errorTip.style.display = 'block';
            return;
        }
        
        if (question.length > 50) {
            this.errorTip.textContent = '字数已超限';
            this.errorTip.style.display = 'block';
            return;
        }
        
        this.currentQuestion = question;
        
        // 保存提问信息到本地存储
        this.saveQuestionToStorage(this.currentScene, question);
        
        // 更新按钮状态
        this.submitQuestionBtn.disabled = true;
        this.submitQuestionBtn.textContent = '加载中...';
        
        // 隐藏提问模块，显示过渡模块
        setTimeout(() => {
            this.hideQuestionModule();
            this.showTransitionModule();
            
            // 生成启示
            this.generateRevelation();
            
            // 重置按钮状态
            this.submitQuestionBtn.disabled = false;
            this.submitQuestionBtn.textContent = '点击触发，获取启示';
            this.questionInput.value = '';
            this.charCount.textContent = '0/50';
        }, 500);
    },
    
    // 生成启示（支持真实API调用和降级方案）
    generateRevelation() {
        // 重置过渡模块状态
        this.retrySection.style.display = 'none';
        
        // 根据问题类型决定使用AI还是预置答案
         const isMeihuaQuestion = this.currentQuestion.startsWith('梅花易数预测');
         
         if (isMeihuaQuestion) {
             // 梅花易数使用AI API
             this.generateRevelationWithAPI().catch(error => {
                 console.error('AI API调用失败:', error);
                 // API调用失败，使用降级方案（预置文案）
                 this.generateRevelationWithPreset();
             });
         } else {
             // 普通问题使用预置答案
             this.generateRevelationWithMock();
         }
    },
    
    // 使用模拟数据生成启示
    generateRevelationWithMock: function() {
        // 如果是梅花易数预测，生成卦象分析
        if (this.currentQuestion.startsWith('梅花易数预测')) {
            const meihuaAnalysis = this.generateMeihuaMockData();
            this.displayRevelation(meihuaAnalysis);
            return;
        }
        
        // 普通询问的模拟数据 - 答案之书模式（500个启示）
        const revelations = [
            // 基础态度类 (50个)
            "保持乐观，好运自然来",
            "心态决定一切",
            "积极面对，困难会过去",
            "微笑面对挑战",
            "相信明天会更好",
            "用善意的眼光看世界",
            "保持内心的平静",
            "接纳生活的不完美",
            "珍惜当下的每一刻",
            "用感恩的心生活",
            "相信自己的价值",
            "勇敢地做自己",
            "保持一颗童心",
            "用爱化解一切",
            "坚持就是胜利",
            "困难是成长的阶梯",
            "失败是成功之母",
            "每一次挫折都是机会",
            "坚持梦想，永不放弃",
            "相信奇迹会发生",
            "今天是最好的开始",
            "每个当下都是礼物",
            "保持好奇心",
            "勇敢尝试新鲜事物",
            "相信直觉的力量",
            "跟随内心的声音",
            "相信美好即将到来",
            "用温柔对待自己",
            "给自己一些时间",
            "相信时间的治愈力",
            "保持希望的火种",
            "用智慧面对问题",
            "相信因果循环",
            "保持谦逊的态度",
            "用慈悲心待人",
            "相信善良的力量",
            "保持内心的纯净",
            "用宽容化解偏见",
            "相信真爱的存在",
            "保持对生活的热爱",
            "用勇气追求梦想",
            "相信努力会有回报",
            "保持对未来的期待",
            "用行动证明自己",
            "相信自己的选择",
            "保持对生活的热情",
            "用真诚对待他人",
            "相信人性的美好",
            "保持对学习的渴望",
            "相信改变的力量",
            
            // 选择决策类 (60个)
            "选一个轻松一些的",
            "非黑即白的答案往往最可靠",
            "听从内心的第一个声音",
            "有时候选择等待更好",
            "相信时间会给出答案",
            "遵从内心的智慧",
            "选择你最能承担的选择",
            "相信你的判断力",
            "不要过度思考",
            "相信你的本能反应",
            "选择让你成长的路",
            "相信你的直觉",
            "有时候不选择也是一种选择",
            "选一个能让你微笑的选择",
            "相信最好的还在后面",
            "选择你不会后悔的路",
            "相信命运的安排",
            "选一个平衡的选择",
            "相信你的心比脑更聪明",
            "选择开放的道路",
            "相信你的潜能无限",
            "选一个充满爱的选择",
            "相信你的光芒会照亮前路",
            "选择你真正想要的",
            "相信你值得最好的",
            "选一个让你自由的选择",
            "相信你的内心有答案",
            "选择你热爱的道路",
            "相信你的选择是完美的",
            "选一个让你安心的选择",
            "相信你的直觉不会错",
            "选择你信任的道路",
            "相信你会找到答案",
            "选一个让你充满希望的选择",
            "相信你的内心平静如水",
            "选择你真正在乎的",
            "相信你的选择带来成长",
            "选一个让你内心安宁的选择",
            "相信你有无限可能",
            "选择你真正热爱的",
            "相信你的选择是命中注定",
            "选一个让你感到自由的选择",
            "相信你的内在智慧",
            "选择你真正想要的生活",
            "相信你的选择充满爱",
            "选一个让你感到完整的选择",
            "相信你的内心指引方向",
            "选择你真正渴望的",
            "相信你的选择会带来奇迹",
            "选一个让你感到安全的选择",
            "相信你的直觉充满智慧",
            "选择你真正认同的道路",
            "相信你会做出正确的决定",
            "选一个让你感到自信的选择",
            "相信你的内心有无穷的力量",
            "选择你真正愿意承担的选择",
            "相信你的选择是最好的安排",
            "选一个让你感到平和的选择",
            "相信你有能力应对一切",
            "选择你真正想去的地方",
            "相信你的选择充满希望",
            
            // 心态调整类 (50个)
            "跟随你的直觉，虽然直觉有时会撒谎",
            "不如换一种角度思考",
            "有时候后退是为了更好地前进",
            "相信过程比相信结果更重要",
            "答案就在你最容易忽视的地方",
            "放下执念，让选择自己出现",
            "不是所有问题都需要立即回答",
            "最复杂的问题往往有最简单的答案",
            "有时候慢下来是为了走得更远",
            "相信最好的还在路上",
            "有时候需要重新审视问题",
            "答案可能就藏在问题里",
            "相信你的内心有答案",
            "有时候需要换一个环境思考",
            "答案可能就在下一个转角",
            "相信时间会治愈一切",
            "有时候需要相信自己更多",
            "答案可能就在你身边",
            "相信你的内在智慧",
            "有时候需要放慢节奏",
            "答案可能就在当下",
            "相信你的直觉很准确",
            "有时候需要换个思路",
            "答案可能就在你的坚持里",
            "相信你的选择是正确的",
            "有时候需要耐心等待",
            "答案可能就在你的努力中",
            "相信你的心比脑更明智",
            "有时候需要换个角度看",
            "答案可能就在你的经历中",
            "相信你的潜能无限",
            "有时候需要相信运气",
            "答案可能就在你的信念里",
            "相信你的努力有回报",
            "有时候需要相信自己",
            "答案可能就在你的坚持中",
            "相信你的选择是最好的",
            "有时候需要换条路走",
            "答案可能就在你的善良中",
            "相信你的直觉是对的",
            "有时候需要等等再看",
            "答案可能就在你的勇气里",
            "相信你的选择有道理",
            "有时候需要换个想法",
            "答案可能就在你的感恩中",
            "相信你的心会指引你",
            "有时候需要相信命运",
            "答案可能就在你的慈悲中",
            "相信你的选择有爱",
            "有时候需要相信美好",
            
            // 时间等待类 (40个)
            "等待让决定自然浮现",
            "答案在水到渠成时自然出现",
            "先做你能做的，其余的交给时间",
            "有时候需要耐心等待",
            "相信时机成熟时会有答案",
            "等待最好的时机出现",
            "相信时间会带来最好的安排",
            "有时候现在不是时候",
            "答案需要时间的酝酿",
            "相信耐心的力量",
            "等待内心的声音清晰",
            "答案会在对的时候出现",
            "相信时间的智慧",
            "有时候需要再等等",
            "答案就在不远的前方",
            "相信等待是有价值的",
            "等待内心的指引",
            "答案会在合适的时候出现",
            "相信时间的安排",
            "有时候需要稍等片刻",
            "答案就在等待的过程中",
            "相信最好的还在后面",
            "等待内心的平静",
            "答案会在适当时机到来",
            "相信等待的美好",
            "有时候需要更多时间",
            "答案就在下一步",
            "相信时间的礼物",
            "等待内心的声音",
            "答案会在最合适的时候出现",
            "相信等待的价值",
            "有时候需要再多一点耐心",
            "答案就在转角处",
            "相信时间的安排完美",
            "等待内心的明白",
            "答案会在对的时刻到来",
            "相信等待带来成长",
            "有时候需要给时间一点时间",
            "答案就在下一个瞬间",
            "相信耐心的回报",
            "等待内心的大智慧",
            
            // 行动实践类 (50个)
            "勇敢迈出第一步",
            "行动胜过千言万语",
            "相信自己有能力改变",
            "今天就开始行动",
            "不要害怕尝试",
            "每一次尝试都是进步",
            "相信自己的力量",
            "勇敢地追求梦想",
            "行动会带来意想不到的收获",
            "相信自己的判断",
            "现在就去做吧",
            "勇敢地承担后果",
            "相信行动的力量",
            "不要犹豫，立即行动",
            "相信自己会成功",
            "勇敢地面对挑战",
            "行动是治愈恐惧的良药",
            "相信自己的选择",
            "现在就行动吧",
            "勇敢地走自己的路",
            "行动会带来新的可能",
            "相信自己的能力",
            "不要等待完美的时机",
            "勇敢地接受挑战",
            "行动会带来新的机遇",
            "相信自己的潜力",
            "现在就迈出第一步",
            "勇敢地表达自己",
            "行动会带来意想不到的惊喜",
            "相信自己的价值",
            "不要害怕犯错误",
            "勇敢地承担责任",
            "行动会带来成长",
            "相信自己的直觉",
            "现在就行动吧",
            "勇敢地追求真理",
            "行动会带来希望",
            "相信自己的梦想",
            "不要担心结果如何",
            "勇敢地相信美好",
            "行动会带来改变",
            "相信自己的善良",
            "现在就采取行动",
            "勇敢地展现真我",
            "行动会带来机会",
            "相信自己的智慧",
            "不要犹豫不决",
            "勇敢地做出决定",
            "行动会带来成功",
            "相信自己的勇敢",
            "现在就行动吧",
            
            // 智慧感悟类 (60个)
            "智慧就在当下",
            "真正的答案在内心深处",
            "生活是最好的老师",
            "每一次经历都有意义",
            "相信自己的内心智慧",
            "答案往往比问题简单",
            "真正的力量来自内心",
            "相信自己的直觉很准确",
            "智慧来源于经历",
            "真正的快乐在于当下",
            "相信自己的内在力量",
            "答案就在问题的背后",
            "真正的勇气是内心的平静",
            "相信自己的判断力",
            "智慧在于观察和思考",
            "真正的自由是内心的释然",
            "相信自己的选择有道理",
            "答案往往在意料之外",
            "真正的成长来自内心",
            "相信自己的潜能",
            "智慧在于保持好奇心",
            "真正的成功是内心的满足",
            "相信自己的价值",
            "答案可能就在身边",
            "真正的智慧是谦逊",
            "相信自己的直觉",
            "答案往往最简单",
            "真正的快乐是简单",
            "相信自己的内心",
            "智慧在于学会倾听",
            "真正的力量是内在的",
            "相信自己的判断",
            "答案就在转念之间",
            "真正的勇气是坚持",
            "相信自己的能力",
            "智慧在于保持纯真",
            "真正的成功是内心的平静",
            "相信自己的选择",
            "答案往往最直接",
            "真正的成长是内心的强大",
            "相信自己的直觉",
            "智慧在于包容一切",
            "真正的自由是内心的解放",
            "相信自己的价值",
            "答案可能最简单",
            "真正的快乐是内心的满足",
            "相信自己的能力",
            "智慧在于相信美好",
            "真正的力量是内心的善良",
            "相信自己的判断",
            "答案往往在最平常的地方",
            "真正的勇气是内心的智慧",
            "相信自己的直觉",
            "智慧在于保持希望",
            "真正的成功是内心的和谐",
            "相信自己的价值",
            "答案可能就在下一步",
            "真正的成长是内心的觉醒",
            "相信自己的能力",
            "智慧在于相信真理",
            "真正的快乐是内心的自由",
            "相信自己的选择",
            
            // 生活哲理类 (50个)
            "生活本身就是最好的答案",
            "每个瞬间都有它的意义",
            "相信生活的安排",
            "生活教会我们成长",
            "真正的答案在生活里",
            "相信每一个当下",
            "生活是一本最好的教科书",
            "真正的智慧来自生活",
            "相信生活会给你最好的",
            "每一个经历都是礼物",
            "生活是最好的老师",
            "真正的答案在当下",
            "相信生活的美好",
            "生活教会我们珍惜",
            "真正的快乐在简单中",
            "相信每一个明天",
            "生活是最好的安排",
            "真正的答案在内心",
            "相信生活的智慧",
            "生活教会我们坚强",
            "真正的力量在当下",
            "相信每一个瞬间",
            "生活是最好的证明",
            "真正的答案在行动中",
            "相信生活的艺术",
            "生活教会我们宽容",
            "真正的智慧在观察中",
            "相信每一个可能",
            "生活是最好的体验",
            "真正的答案在选择中",
            "相信生活的意义",
            "生活教会我们感恩",
            "真正的快乐在给予中",
            "相信每一个机会",
            "生活是最好的疗愈",
            "真正的答案在坚持中",
            "相信生活的节奏",
            "生活教会我们谦逊",
            "真正的智慧在接纳中",
            "相信每一个改变",
            "生活是最好的导师",
            "真正的答案在勇敢中",
            "相信生活的安排",
            "生活教会我们成长",
            "真正的快乐在分享中",
            "相信每一个梦想",
            "生活是最好的舞台",
            "真正的答案在相信中",
            "相信生活的奇迹",
            
            // 内心平静类 (40个)
            "内心平静是最好的指引",
            "保持内心的宁静",
            "相信内心的智慧",
            "在安静中找到答案",
            "内心平静如水",
            "相信内心的声音",
            "在冥想中得到启示",
            "内心安宁是最大的财富",
            "相信内心的平静",
            "在静默中找到方向",
            "内心宁静致远",
            "相信内心的指引",
            "在安静中倾听心声",
            "内心平和是最大的力量",
            "相信内心的慈悲",
            "在静心中找到答案",
            "内心安静如夜",
            "相信内心的温暖",
            "在宁静中得到启示",
            "内心平静是最大的幸福",
            "相信内心的善良",
            "在安静中感受美好",
            "内心安宁如家",
            "相信内心的光芒",
            "在静默中寻找智慧",
            "内心平静如镜",
            "相信内心的声音",
            "在安静中倾听真理",
            "内心宁静如山",
            "相信内心的智慧",
            "在静心中感受平静",
            "内心安静如海",
            "相信内心的指引",
            "在宁静中得到答案",
            "内心平静如风",
            "相信内心的声音",
            "在安静中寻找光明",
            "内心安宁如茶",
            "相信内心的平静",
            "在静默中感受智慧",
            
            // 成长学习类 (50个)
            "每一次学习都是成长",
            "保持学习的心态",
            "相信自己会不断进步",
            "成长来自于不断尝试",
            "相信学习的力量",
            "每一次错误都是学习",
            "成长需要勇气和坚持",
            "相信自己的成长潜力",
            "学习让生活更美好",
            "每一次进步都值得庆祝",
            "成长来自于内心的觉醒",
            "相信自己的学习能力",
            "每一次尝试都是收获",
            "成长是终身的旅程",
            "相信自己的成长过程",
            "学习是最好的投资",
            "每一次经历都是课堂",
            "成长来自于反思和总结",
            "相信自己的学习热情",
            "每一次挑战都是机会",
            "成长来自于突破舒适区",
            "相信自己的成长速度",
            "学习让思维更开阔",
            "每一次思考都是进步",
            "成长来自于自我认知",
            "相信自己的成长方向",
            "每一次探索都有发现",
            "成长来自于新的体验",
            "相信自己的成长能力",
            "学习让视野更宽广",
            "每一次发现都令人兴奋",
            "成长来自于不断突破",
            "相信自己的成长步伐",
            "每一次创新都有价值",
            "成长来自于勇敢尝试",
            "相信自己的学习天赋",
            "每一次创造都有意义",
            "成长来自于内心的渴望",
            "相信自己的成长天赋",
            "每一次发现都充满惊喜",
            "成长来自于持续的探索",
            "相信自己的学习潜力",
            "每一次进步都令人骄傲",
            "成长来自于永不放弃",
            "相信自己的成长动力",
            "每一次学习都带来快乐",
            "成长来自于对世界的好奇",
            "相信自己的成长历程",
            "每一次体验都值得珍惜"
        ];
        
        // 随机选择1-2个答案进行组合
        const firstIndex = Math.floor(Math.random() * revelations.length);
        const firstAnswer = revelations[firstIndex];
        
        // 30%概率组合两个答案
        const secondAnswer = Math.random() < 0.3 ? revelations[Math.floor(Math.random() * revelations.length)] : '';
        const combinedAnswer = secondAnswer ? `${firstAnswer} ${secondAnswer}` : firstAnswer;
        
        console.log('选择的启示:', { firstIndex, firstAnswer, secondAnswer, combinedAnswer });
        
        this.displayRevelation(combinedAnswer);
    },
    
    // 梅花易数模拟数据生成
    generateMeihuaMockData: function() {
        // 增强随机性：结合时间和用户输入来生成随机索引
        const userInput = this.currentQuestion || '';
        const timeSeed = Date.now();
        const charCodeSum = userInput.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        
        const analyses = [
            `【本卦】：乾为天 - 天行健，君子以自强不息
【变卦】：天风姤 - 相遇契机，把握机遇
【互卦】：天雷无妄 - 不妄为，遵从内心
【总体分析】：当前情况充满积极向上的能量，如天行健般持续不断。此卦显示您正处于需要坚持不懈的时刻，虽然过程可能会有挑战，但整体趋势是向好的。乾卦的刚健特质表明您有足够的能力和意志力去面对当前的困难。
【智慧指引】：保持积极的心态和行动力，相信自己的能力，勇于承担责任。时机成熟时，自然会有好的结果。重要的是保持耐心和坚持，不要急于求成。`,

            `【本卦】：坤为地 - 地势坤，君子以厚德载物
【变卦】：地山谦 - 谦逊待人，谦让有度
【互卦】：山地剥 - 化繁为简，回归本质
【总体分析】：坤卦象征包容和承载，当前情况需要您以柔克刚的方式处理。此卦提醒您要有耐心和包容心，像大地一样承载万物。运势正处于积累阶段，虽然进展可能较慢，但基础会越来越稳固。
【智慧指引】：保持谦逊和包容的心态，不要过于急躁。以德服人，以情感人。困难时寻求帮助，成功时保持低调。德行的积累终会带来好的结果。`,

            `【本卦】：水雷屯 - 万事开头难，但前景光明
【变卦】：水火既济 - 阴阳调合，事业有成
【互卦】：山水蒙 - 学习成长，智慧启发
【总体分析】：屯卦表示初始阶段的困难和挑战，如雷电交加的云雨要降下大地。当前您可能面临一些阻力和不确定性，但这是成长过程中的必经阶段。卦象显示困难是暂时的，前景是光明的。
【智慧指引】：当前阶段需要更多的耐心和坚持，不要因为暂时的困难而放弃。把挑战看作是成长的机会，保持学习的姿态。时机未到时要潜心准备，时机成熟时要果断行动。`,

            `【本卦】：山水蒙 - 智慧开启在即，保持学习心态
【变卦】：地水师 - 领军前行，承担责任
【互卦】：山地剥 - 剥除偏见，回归纯真
【总体分析】：蒙卦象征启蒙和学习，当前您正处于需要获取新知识和新智慧的时候。此卦显示您即将在某个领域获得重要的认知突破，但需要保持开放和学习的心态。智慧的种子正在萌芽。
【智慧指引】：保持谦虚学习的态度，不要被既有的认知所限制。多向有经验的人请教，多思考问题的本质。即将到来的灵感可能会为您指明方向，要珍惜这个成长的机会。`,

            `【本卦】：水天需 - 守正待时，耐心等待
【变卦】：水地比 - 团结合作，众志成城
【互卦】：天风姤 - 缘分将至，把握机会
【总体分析】：需卦表示时机尚未成熟，需要耐心等待和准备。当前的情况不适合急进，而应该修养自身，积累实力。天时未至，强行推进只会带来不利。等待不是消极的，而是积极的准备。
【智慧指引】：在等待的期间要保持内心的平静和坚定，利用这段时间充实自己。与志同道合的人保持联系，为未来的机会做好准备。当外在条件成熟时，要能够果断地把握住机会。`,

            `【本卦】：天水讼 - 意见分歧，需要沟通
【变卦】：天地否 - 阴阳不调，暂时阻滞
【互卦】：风地观 - 观察思考，审时度势
【总体分析】：讼卦表示当前存在分歧和争议，需要通过沟通来解决。此卦提醒您要谨慎处理人际关系，避免冲突激化。虽然有分歧，但通过适当的沟通和妥协，问题是可以解决的。
【智慧指引】：保持冷静和理性，避免情绪化的反应。多倾听对方的观点，寻找双方的共同点。在沟通中保持诚实和公正，但也要灵活变通。时间会淡化矛盾，智慧会化解分歧。`,

            `【本卦】：地水师 - 领军前行，承担责任
【变卦】：地雷复 - 重新开始，否极泰来
【互卦】：山地剥 - 精炼提升，去伪存真
【总体分析】：师卦象征领导和责任，当前您需要承担起更大的责任，引领他人共同前进。此卦显示您有能力担当重任，但也需要考虑团队合作的重要性。领导不仅是权力，更是服务和责任。
【智慧指引】：在承担责任时要保持谦逊和公正，多为团队成员着想。以身作则，用行动来影响和带动他人。在关键时刻要能够做出正确的决定，带领团队走出困境，获得成功。`,

            `【本卦】：水地比 - 团结合作，众志成城
【变卦】：水雷屯 - 困难中见真情
【互卦】：风地观 - 以德服人，以理服人
【总体分析】：比卦表示团结和谐的重要性，当前您需要更多的合作和支持。此卦显示通过团结可以克服困难，通过合作可以取得更大的成就。和谐的人际关系是成功的基石。
【智慧指引】：主动与他人建立良好的关系，多一些包容和理解。在团队中发挥自己的作用，同时也要支持他人。通过真诚的合作和相互支持，共同创造更好的结果。记住团结就是力量。`,

            `【本卦】：风天小畜 - 积少成多，稳步前进
【变卦】：巽为风 - 柔顺谦逊，因势利导
【互卦】：天火同人 - 志同道合，共创未来
【总体分析】：小畜卦表示积累和准备的重要性，当前需要通过小的积累来为大的成就做准备。此卦提醒您要有耐心，从小处着手，稳步推进。大成来自于小的积累，成功来自于持续的努力。
【智慧指引】：珍惜每一个小的进步和积累，不要急于求成。保持谦逊学习的心态，多向优秀的人学习。通过持续的努力和积累，为将来的大发展做好准备。相信积少成多的力量。`,

            `【本卦】：天泽履 - 谨慎行事，步步为营
【变卦】：天雷无妄 - 遵从本心，不妄为
【互卦】：离为火 - 光明在前，正义必胜
【总体分析】：履卦表示需要谨慎行事，在复杂的环境中找到正确的道路。此卦提醒您要保持警觉，明辨是非，在行动之前要充分思考。谨慎不是胆怯，而是智慧的表现。
【智慧指引】：在做出重要决定时要深思熟虑，多听取他人的建议。保持正直的品格，不被利益诱惑所左右。在困难的时刻要保持原则，在复杂的环境中要坚持正道。谨慎前行，终将到达目标。`
        ];
        
        // 使用更复杂的随机种子生成随机索引
        const randomSeed = Math.floor(Math.random() * 1000000) + timeSeed + charCodeSum;
        const randomIndex = randomSeed % analyses.length;
        
        console.log('梅花易数分析 - 随机索引:', randomIndex, '问题:', userInput);
        return analyses[randomIndex];
    },
    
    // 统一显示启示的方法
    displayRevelation: function(content) {
        this.currentRevelation = content;
        
        // 隐藏过渡模块，显示答案模块
        this.hideTransitionModule();
        this.showRevelationModule();
        
        // 使用打字机效果显示启示
        this.typewriterEffect(this.currentRevelation);
        
        // 保存到历史记录
        this.saveToHistory();
        
        // 更新收藏按钮状态
        this.updateCollectionButtonState();
    },
    
    // 为梅花易数添加滑动检测
    addSlideDetection: function() {
        const transitionModule = this.transitionModule;
        let isSliding = false;
        let startY = 0;
        let currentY = 0;
        
        // 清除之前的事件监听器
        const existingHandler = transitionModule.ontouchstart;
        if (existingHandler) {
            transitionModule.removeEventListener('touchstart', existingHandler);
            transitionModule.removeEventListener('touchmove', existingHandler);
            transitionModule.removeEventListener('touchend', existingHandler);
        }
        
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
            isSliding = false;
        };
        
        const handleTouchMove = (e) => {
            if (!startY) return;
            
            currentY = e.touches[0].clientY;
            const diffY = startY - currentY;
            
            // 如果向下滑动距离超过50px，触发滑动
            if (diffY > 50) {
                isSliding = true;
                e.preventDefault();
                
                // 添加滑动视觉效果
                transitionModule.style.transform = `translateY(${Math.min(diffY - 50, 100)}px)`;
                transitionModule.style.opacity = `${1 - (diffY - 50) / 200}`;
            }
        };
        
        const handleTouchEnd = (e) => {
            if (isSliding) {
                // 如果滑动距离足够大，直接显示结果
                const diffY = startY - currentY;
                if (diffY > 100) {
                    this.slideToResult();
                } else {
                    // 否则回到原位
                    transitionModule.style.transform = 'translateY(0)';
                    transitionModule.style.opacity = '1';
                }
            }
            
            // 重置状态
            startY = 0;
            currentY = 0;
            isSliding = false;
        };
        
        // 添加事件监听器
        transitionModule.addEventListener('touchstart', handleTouchStart, { passive: false });
        transitionModule.addEventListener('touchmove', handleTouchMove, { passive: false });
        transitionModule.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // 保存事件处理器引用以便后续清理
        transitionModule.ontouchstart = handleTouchStart;
    },

    // 清理滑动检测事件监听器
    cleanupSlideDetection: function() {
        const transitionModule = this.transitionModule;
        const existingHandler = transitionModule.ontouchstart;
        
        if (existingHandler) {
            transitionModule.removeEventListener('touchstart', existingHandler);
            transitionModule.removeEventListener('touchmove', existingHandler);
            transitionModule.removeEventListener('touchend', existingHandler);
            
            // 清除保存的处理器引用
            transitionModule.ontouchstart = null;
        }
    },
    
    // 滑动到结果页面
    slideToResult: function() {
        // 添加滑动完成的动画效果
        this.transitionModule.style.transition = 'all 0.5s ease-out';
        this.transitionModule.style.transform = 'translateY(-100vh)';
        this.transitionModule.style.opacity = '0';
        
        // 延迟显示结果，让动画完成
        setTimeout(() => {
            this.hideTransitionModule();
            this.showRevelationModule();
            
            // 重置过渡模块样式
            this.transitionModule.style.transform = 'translateY(0)';
            this.transitionModule.style.opacity = '1';
            this.transitionModule.style.transition = '';
            
            // 使用打字机效果显示启示
            this.typewriterEffect(this.currentRevelation);
            
            // 保存到历史记录
            this.saveToHistory();
            
            // 更新收藏按钮状态
            this.updateCollectionButtonState();
        }, 500);
    },
    
    // 使用AI API生成启示（真实API调用）
    generateRevelationWithAPI: async function() {
        try {
            // 构建系统提示和用户提示
            let systemPrompt = '';
            let userPrompt = '';
            
            // 如果是梅花易数预测，添加梅花易数的参数
            if (this.currentQuestion.startsWith('梅花易数预测')) {
                systemPrompt = `你是一位精通梅花易数的玄学大师。请根据用户提供的时间、随机数和事件内容，运用梅花易数理论生成完整的卦象分析。请严格按照以下格式回答（100-200字）：

【本卦】：[卦名] - [卦辞原意和当前境况的对应]
【变卦】：[变卦名称] - [事态发展方向和变化趋势]
【互卦】：[互卦名称] - [内在因素和隐藏机会]
【总体分析】：结合时间、随机数的梅花易数理法，对当前事件进行深入分析，判断吉凶趋势
【智慧指引】：基于卦象给出具体可操作的建议和行动指南

梅花易数要求：
1. 必须严格按照本卦、变卦、互卦、总体分析、智慧指引五个部分
2. 要体现梅花易数特色，结合时间数字的数理分析
3. 语言要专业但通俗易懂，充满智慧和正能量
4. 必须给出具体明确的指导，不能泛泛而谈
5. 总字数严格控制在100-200字之间`;

                // 格式化时间
                const formattedTime = this.formatDateTimeForPlumBlossom(this.plumBlossomData.time);
                
                userPrompt = `事件内容：${this.plumBlossomData.event}
预测时间：${formattedTime}
随机数字：${this.plumBlossomData.randomNumber}

请严格按照梅花易数理论进行专业分析，生成完整的卦象解读。`;
            } else {
                // 普通询问使用智能AI回答模式
                systemPrompt = `你是一位充满智慧的占卜师和人生导师。你的回答要：
1. 语言温暖而富有哲理
2. 给用户具体的指导和建议
3. 回答要有个性化，避免千篇一律
4. 长度控制在80-150字之间
5. 语言要积极向上，给人希望和力量`;

                userPrompt = `${this.currentQuestion}`;
            }
            
            // 用户提供的API密钥和主机地址
            // 注意：在生产环境中，应该将API密钥存储在安全的地方，而不是硬编码
            const apiKey = 'sk-tdhjhFmizAl4soeNFdOgeYVvhZebLFBO8E0gMQ29xbEFEs1E'; // 用户提供的API密钥
            const url = 'https://api.chatanywhere.tech/v1/chat/completions'; // 用户提供的API主机地址
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    stream: true,
                    temperature: 0.7
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API响应错误: ${response.status}`);
            }
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            
            // 最小停留时间3秒
            const minDelayPromise = new Promise(resolve => setTimeout(resolve, 3000));
            
            // 流式读取响应
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    break;
                }
                
                // 解码并累积数据到缓冲区
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                // 按行分割处理
                const lines = buffer.split('\n');
                // 保留最后一行（可能是部分数据）
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.trim() === '') {
                        continue; // 跳过空行
                    }
                    
                    if (line.trim().startsWith('data:')) {
                        const data = line.trim().substring(5).trim();
                        
                        // 检查结束信号
                        if (data === '[DONE]') {
                            console.log('收到结束信号');
                            break;
                        }
                        
                        // 跳过空数据
                        if (data === '') {
                            continue;
                        }
                        
                        try {
                            // 验证JSON格式是否完整
                            if (data.startsWith('{') && data.endsWith('}')) {
                                const parsed = JSON.parse(data);
                                
                                // 检查是否包含有效内容
                                if (parsed.choices && 
                                    parsed.choices[0] && 
                                    parsed.choices[0].delta && 
                                    typeof parsed.choices[0].delta.content === 'string') {
                                    fullResponse += parsed.choices[0].delta.content;
                                }
                            }
                        } catch (e) {
                            // 静默处理JSON解析错误，避免频繁输出
                            if (!data.includes('[DONE]')) {
                                console.warn('跳过无效的流式数据片段');
                            }
                        }
                    }
                }
                
                // 如果遇到[DONE]，退出循环
                if (buffer.includes('[DONE]')) {
                    console.log('流式响应结束');
                    break;
                }
            }
            
            // 处理缓冲区中可能剩余的数据
            if (buffer.trim() && buffer.includes('[DONE]')) {
                console.log('处理剩余的结束信号');
            }
            
            // 等待最小停留时间
            await minDelayPromise;
            
            this.currentRevelation = fullResponse.trim() || this.getDefaultRevelation();
            
            // 隐藏过渡模块，显示答案模块
            this.hideTransitionModule();
            this.showRevelationModule();
            
            // 使用打字机效果显示启示
            this.typewriterEffect(this.currentRevelation);
            
            // 更新收藏按钮状态
            this.updateCollectionButtonState();
            
        } catch (error) {
            console.error('AI API调用失败:', error);
            
            // API调用失败时使用梅花易数的预置卦象分析作为降级方案
            console.log('AI接口调用失败，启用降级方案：使用预置卦象分析');
            
            // 创建一个包含当前梅花易数数据的模拟分析
            setTimeout(() => {
                const mockAnalysis = this.generateMeihuaMockDataFallback();
                this.currentRevelation = mockAnalysis;
                
                // 隐藏过渡模块，显示答案模块
                this.hideTransitionModule();
                this.showRevelationModule();
                
                // 使用打字机效果显示启示
                this.typewriterEffect(this.currentRevelation);
                
                // 更新收藏按钮状态
                this.updateCollectionButtonState();
            }, 1500); // 较短延迟，因为是降级方案
        }
    },
    
    // 格式化梅花易数的时间
    formatDateTimeForPlumBlossom: function(datetimeStr) {
        const date = new Date(datetimeStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        // 格式化为：年/月/日/时
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${hours.toString().padStart(2, '0')}`;
    },
    
    // 使用预置文案（降级方案）- 分类答案模式
    // 梅花易数AI接口降级方案 - 基于当前数据生成模拟分析
    generateMeihuaMockDataFallback: function() {
        // 获取当前的梅花易数数据
        const randomNumber = this.plumBlossomData ? this.plumBlossomData.randomNumber : '';
        const eventTime = this.plumBlossomData ? this.plumBlossomData.time : '';
        
        // 基于时间生成不同的预置分析
        const now = new Date();
        const hour = now.getHours();
        const timeBasedInsight = this.getTimeBasedInsight(hour);
        
        // 基于随机数生成数字分析
        const numberAnalysis = this.getNumberAnalysis(randomNumber);
        
        // 组合生成分析文本
        const mockAnalysis = `根据梅花易数推算得出：

时间因素：${timeBasedInsight}

数字 ${randomNumber} 的启示：
${numberAnalysis}

综合建议：
在当前的时机下，建议您保持内心的平静与专注。无论是选择还是行动，都应该遵循内心的指引，同时注意周围的时机变化。数字${randomNumber}象征着特定的力量与指引，相信它会为您的决策带来清晰的思路。

最重要的是，无论结果如何，都要保持积极的心态，相信每一次的经历都是成长的机会。`;
        
        return mockAnalysis;
    },

    // 基于时间获取洞察
    getTimeBasedInsight: function(hour) {
        const timeInsights = {
            morning: '清晨时光代表新的开始，适合做出重要的决定',
            noon: '正午时分阳气最盛，适合行动和推进',
            afternoon: '午后时光适合反思和调整方向',
            evening: '黄昏时分适合总结和规划',
            night: '深夜时分适合冥想和内心沟通'
        };
        
        if (hour >= 6 && hour < 10) return timeInsights.morning;
        if (hour >= 10 && hour < 14) return timeInsights.noon;
        if (hour >= 14 && hour < 17) return timeInsights.afternoon;
        if (hour >= 17 && hour < 21) return timeInsights.evening;
        return timeInsights.night;
    },

    // 基于数字生成分析
    getNumberAnalysis: function(number) {
        if (!number || isNaN(number)) {
            return '数字的力量在于它所代表的意义和能量。';
        }
        
        const numberMeanings = {
            '1': '代表新的开始和独立的力量，鼓励您勇敢迈出第一步',
            '2': '象征合作与平衡，提醒您寻求与他人的协调',
            '3': '代表创造力与表达，鼓励您发挥创意',
            '4': '象征稳定与秩序，建议您建立坚实的基础',
            '5': '代表自由与变化，提醒您保持开放的心态',
            '6': '象征和谐与责任，强调关爱和承担',
            '7': '代表直觉与智慧，鼓励您倾听内心的声音',
            '8': '象征力量与成就，提醒您坚持不懈',
            '9': '代表完成与智慧，建议您总结经验'
        };
        
        // 对多位数进行递归分析
        let finalNumber = parseInt(number);
        while (finalNumber > 9) {
            const digits = finalNumber.toString().split('').map(Number);
            finalNumber = digits.reduce((sum, digit) => sum + digit, 0);
        }
        
        return numberMeanings[finalNumber.toString()] || '每个数字都有其独特的能量和意义，相信这个数字会为您带来指引。';
    },

    generateRevelationWithPreset: function() {
        // 模拟获取预置文案的延迟
        setTimeout(() => {
            // 根据当前场景类型从对应分类答案库中选择
            const categoryAnswers = this.getAnswersByCategory();
            const randomAnswer = categoryAnswers[Math.floor(Math.random() * categoryAnswers.length)];
            this.currentRevelation = randomAnswer;
            
            // 隐藏过渡模块，显示答案模块
            this.hideTransitionModule();
            this.showRevelationModule();
            
            // 使用打字机效果显示启示
            this.typewriterEffect(this.currentRevelation);
            
            // 更新收藏按钮状态
            this.updateCollectionButtonState();
        }, 2000);
    },

    // 根据场景类型获取对应分类的答案库
    getAnswersByCategory: function() {
        const currentScene = this.currentScene || 'daily';
        
        // 职场类答案库（85个）
        const jobAnswers = [
            "机会总是留给有准备的人",
            "磨刀不误砍柴工",
            "工欲善其事，必先利其器",
            "千里之行，始于足下",
            "一分耕耘，一分收获",
            "天道酬勤",
            "厚德载物",
            "水滴石穿",
            "聚沙成塔",
            "细节决定成败",
            "慢工出细活",
            "坚持不一定胜利，但放弃一定失败",
            "万事开头难",
            "书山有路勤为径",
            "学海无涯苦作舟",
            "临渊羡鱼，不如退而结网",
            "授人以鱼不如授人以渔",
            "青出于蓝而胜于蓝",
            "失败是成功之母",
            "有时候失败是为了更大的成功",
            "塞翁失马，焉知非福",
            "物极必反，否极泰来",
            "静下心来，世界会变得更清晰",
            "相信过程比相信结果更重要",
            "有时候后退是为了更好地前进",
            "换个环境可能会有新发现",
            "跳出框架思考",
            "不如换一种角度思考",
            "重新定义这个问题会更有趣",
            "答案可能就在下一个转角",
            "看似无关的事物往往暗含线索",
            "倾听内心的声音，即使它很轻很轻",
            "跟随你的直觉，虽然直觉有时会撒谎",
            "锋芒毕露不如内敛含蓄",
            "小心驶得万年船",
            "种什么因，得什么果",
            "非黑即白的答案往往最可靠",
            "先做你能做的，其余的交给时间",
            "每个选择都有其存在的理由",
            "有时候不选择也是一种选择",
            "等待让决定自然浮现",
            "答案在水到渠成时自然出现",
            "时间会给出最好的答案",
            "好事多磨，急不得",
            "一切都是最好的安排",
            "顺其自然比强求更有效",
            "最艰难的时刻往往是最关键的时刻",
            "机会在于把握，不在于等待",
            "能力需要展现，但更需要坚持",
            "团队协作胜过个人英雄主义",
            "沟通是解决问题的第一步",
            "谦逊是进步的开始",
            "批评是改进的机会",
            "目标明确才能事半功倍",
            "执行力决定竞争力",
            "创新思维是突破的关键",
            "经验是最好的老师",
            "学习永无止境",
            "专注能创造奇迹",
            "耐心等待时机成熟",
            "行动胜过千言万语",
            "责任担当是成长的标志",
            "合作共赢是大势所趋",
            "持续改进是成功的保证",
            "目标分解，化整为零",
            "从小事做起，积累大成",
            "困难是成长的阶梯",
            "挫折是成功的垫脚石",
            "态度决定高度",
            "格局决定结局",
            "思路决定出路",
            "选择比努力更重要",
            "定位决定地位",
            "思维决定行为",
            "观念决定方向",
            "格局决定结局",
            "心胸决定格局",
            "眼光决定未来",
            "视野决定境界",
            "心态决定状态",
            "习惯决定命运",
            "性格决定成败",
            "品格决定高度",
            "素养决定影响力",
            "格局决定影响力"
        ];
        
        // 情感类答案库（85个）
        const loveAnswers = [
            "百年修得同船渡",
            "缘分天注定，相守靠人心",
            "善有善报，恶有恶报",
            "得饶人处且饶人",
            "己所不欲，勿施于人",
            "真诚是情感的基础",
            "理解是沟通的桥梁",
            "信任是关系的纽带",
            "包容是爱的表现",
            "耐心是感情的考验",
            "倾听比说话更重要",
            "陪伴是最长情的告白",
            "相濡以沫，不离不弃",
            "心有灵犀一点通",
            "患难见真情",
            "日久见人心",
            "真心换真心",
            "感情需要经营",
            "爱情需要面包，更需要信任",
            "家庭和睦万事兴",
            "家有一老，如有一宝",
            "孝顺父母是最大的福报",
            "兄弟齐心，其利断金",
            "朋友是另一个自己",
            "友谊天长地久",
            "知音难觅，真情可贵",
            "感恩的心，珍惜身边的人",
            "宽恕别人，善待自己",
            "放下执念，获得自由",
            "宽容是美德",
            "理解和包容是情感的真谛",
            "真诚待人，温暖自己",
            "善良的人运气不会太差",
            "付出总会有回报",
            "爱出者爱返，福往者福来",
            "修己以安人",
            "德厚流光，家和业兴",
            "夫妻相敬如宾",
            "相敬如宾，举案齐眉",
            "夫妻本是同林鸟",
            "孩子的笑容是家的阳光",
            "家和万事兴",
            "亲情无价",
            "血浓于水",
            "打断骨头连着筋",
            "亲情是最牢固的纽带",
            "兄弟姐妹情深",
            "长幼有序，和睦相处",
            "百善孝为先",
            "老人是家庭的财富",
            "孩子是家庭的希望",
            "教育是最好的投资",
            "言传身教，以身作则",
            "爱心是教育的灵魂",
            "尊重孩子的个性发展",
            "陪伴是最好的教育",
            "理解是沟通的开始",
            "沟通是解决问题的关键",
            "换位思考才能相互理解",
            "站在对方的角度想想",
            "不要用爱的名义伤害",
            "爱的表达方式很重要",
            "感情需要表达，更需要行动",
            "细节体现真情",
            "小别胜新婚",
            "距离产生美",
            "感情需要保鲜",
            "珍惜当下，把握幸福",
            "感情路上不要急",
            "真爱需要等待",
            "有情人终成眷属",
            "爱情是两个人共同成长",
            "互相支持，共同进步",
            "爱情需要共同的价值观",
            "相知相守，白头偕老",
            "感情需要责任和担当",
            "承诺是用行动兑现的",
            "忠诚是感情的底线",
            "专一是感情的基石",
            "真挚的感情经得起考验",
            "时间会证明一切",
            "真心永远不会错付",
            "爱情没有标准答案",
            "每个感情都是独特的",
            "用心感受，用爱经营"
        ];
        
        // 日常琐事类答案库（80个）
        const dailyAnswers = [
            "生活需要仪式感",
            "慢生活，享受当下",
            "简单就是幸福",
            "知足者常乐",
            "平凡的日子也有诗意",
            "每天都是新的开始",
            "生活需要一点小惊喜",
            "保持童心，生活更有趣",
            "健康是最大的财富",
            "早睡早起身体好",
            "运动让你更年轻",
            "饮食有节，起居有常",
            "适当放松很重要",
            "休息是为了更好地工作",
            "劳逸结合效率高",
            "养成良好的生活习惯",
            "细节决定生活品质",
            "整洁的环境带来好心情",
            "房间要常清理，心情要常梳理",
            "断舍离让生活更轻松",
            "极简生活，品质人生",
            "少即是多",
            "适合自己的才是最好的",
            "花钱要花在刀刃上",
            "量入为出最稳妥",
            "投资自己永远不会错",
            "学习是最好的投资",
            "阅读让你更有内涵",
            "多出去走走，开阔眼界",
            "世界那么大，要去看看",
            "旅行是最好的老师",
            "读万卷书，行万里路",
            "与其宅在家里，不如出门走走",
            "亲近大自然，放松身心",
            "阳光能驱散阴霾",
            "绿植能净化空气",
            "养个小宠物作伴",
            "兴趣爱好丰富生活",
            "培养一个终身爱好",
            "音乐能治愈心灵",
            "艺术让生活更美好",
            "手工制作有成就感",
            "烹饪是生活的艺术",
            "美食能治愈一切",
            "和朋友聚餐是快乐源泉",
            "独处也是一种享受",
            "学会与自己和解",
            "内心的平静最珍贵",
            "冥想能净化心灵",
            "感恩生活中的美好",
            "每天给自己一个微笑",
            "正能量会传染",
            "保持乐观的心态",
            "笑一笑，十年少",
            "压力需要释放",
            "学会说'不'很重要",
            "不要把别人的评价看得太重",
            "做自己最快乐",
            "不要总是与别人比较",
            "专注于自己的成长",
            "每个阶段都有它的美好",
            "接受不完美的自己",
            "慢慢来，比较快",
            "有些事急不得",
            "顺其自然，水到渠成",
            "车到山前必有路",
            "天无绝人之路",
            "办法总比困难多",
            "没有过不去的坎",
            "困难是暂时的",
            "坚持就是胜利",
            "困难是最好的老师",
            "失败是成功的必经之路",
            "跌倒了就爬起来",
            "勇敢面对现实",
            "接受无法改变的",
            "改变能够改变的",
            "智慧在于分辨二者的区别",
            "生活的智慧在于平衡",
            "平凡的快乐最真实"
        ];
        
        // 通用答案库（50个）
        const generalAnswers = [
            "选一个轻松一些的",
            "相信直觉的力量",
            "答案就在你心中",
            "跟随内心的声音",
            "不要想太多，行动最重要",
            "换个角度看问题",
            "时间会给出最好的答案",
            "一切都是最好的安排",
            "静待花开",
            "车到山前必有路",
            "船到桥头自然直",
            "否极泰来",
            "物极必反",
            "塞翁失马，焉知非福",
            "失之东隅，收之桑榆",
            "柳暗花明又一村",
            "山重水复疑无路",
            "守得云开见月明",
            "皇天不负有心人",
            "功夫不负有心人",
            "有志者事竟成",
            "精诚所至，金石为开",
            "滴水穿石",
            "聚沙成塔",
            "积少成多",
            "千里之行，始于足下",
            "不积跬步，无以至千里",
            "磨刀不误砍柴工",
            "工欲善其事，必先利其器",
            "临渊羡鱼，不如退而结网",
            "授人以鱼不如授人以渔",
            "给人玫瑰，手有余香",
            "助人即助己",
            "善有善报",
            "种瓜得瓜，种豆得豆",
            "种什么因，得什么果",
            "厚德载物",
            "德厚流光",
            "上善若水",
            "厚德载物",
            "天道酬勤",
            "地道酬善",
            "人道酬诚",
            "商道酬信",
            "君子以厚德载物",
            "厚德载物，宁静致远",
            "德厚流光，家和业兴",
            "德高望重，众望所归",
            "德馨品高，志存高远",
            "德才兼备，方得始终"
        ];
        
        // 根据场景类型选择对应答案库，添加通用答案作为补充
        let answers = [];
        
        switch(currentScene) {
            case 'job':
                answers = [...jobAnswers, ...generalAnswers]; // 职场 + 通用
                break;
            case 'love':
                answers = [...loveAnswers, ...generalAnswers]; // 情感 + 通用
                break;
            case 'daily':
                answers = [...dailyAnswers, ...generalAnswers]; // 琐事 + 通用
                break;
            default:
                answers = [...dailyAnswers, ...generalAnswers]; // 默认琐事 + 通用
        }
        
        return answers;
    },
    
    // 获取场景对应的核心思想（模拟调用云函数）
    getGuaByScene: async function() {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 场景对应的核心思想
        const coreIdeas = {
            job: '职业发展中的平衡与机遇把握',
            love: '情感关系中的理解与沟通',
            daily: '日常生活中的取舍与心态调整'
        };
        
        return coreIdeas[this.currentScene] || '寻找内心的平衡';
    },
    
    // 获取默认启示内容
    getDefaultRevelation: function() {
        return '在思考中找到方向，答案就在你的内心深处。';
    },
    
    // 打字机效果
    typewriterEffect: function(text) {
        let index = 0;
        this.revelationText.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                this.revelationText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50 + Math.random() * 100); // 随机速度，更自然
            }
        };
        
        type();
    },
    
    // 更新启示文本
    updateRevelationText: function(text) {
        // 对梅花易数的输出进行特殊格式化处理
        if (this.currentQuestion && this.currentQuestion.startsWith('梅花易数预测')) {
            // 格式化梅花易数的输出，使其更加简洁干练
            let formattedText = this.formatPlumBlossomOutput(text);
            this.revelationText.innerHTML = formattedText;
            this.revelationText.classList.add('meihua-format');
        } else {
            this.revelationText.textContent = text;
            this.revelationText.classList.remove('meihua-format');
        }
    },
    
    // 格式化梅花易数输出
    formatPlumBlossomOutput: function(text) {
        // 确保积极正面的基调
        let originalText = text.trim();
        
        // 移除可能的冗余前缀
        const prefixes = ['梅花易数预测结果：', '根据梅花易数分析：', '卦象推断：'];
        for (const prefix of prefixes) {
            if (originalText.startsWith(prefix)) {
                originalText = originalText.substring(prefix.length).trim();
                break;
            }
        }
        
        // 移除任何消极内容
        const negativeWords = ['不吉', '凶', '困难', '失败', '阻碍', '不利'];
        let cleanText = originalText;
        for (const neg of negativeWords) {
            cleanText = cleanText.replace(new RegExp(neg, 'g'), '需要克服的挑战');
        }
        
        // 提取卦象信息的模式
        const guaPatterns = [
            /本卦[：:]([^。！？\n\r]+)/g,
            /上卦[：:]([^。！？\n\r]+)/g, 
            /下卦[：:]([^。！？\n\r]+)/g,
            /变卦[：:]([^。！？\n\r]+)/g,
            /互卦[：:]([^。！？\n\r]+)/g,
            /主卦[：:]([^。！？\n\r]+)/g,
            /体卦[：:]([^。！？\n\r]+)/g,
            /用卦[：:]([^。！？\n\r]+)/g,
            /之卦[：:]([^。！？\n\r]+)/g,
            /世爻[：:]([^。！？\n\r]+)/g,
            /应爻[：:]([^。！？\n\r]+)/g,
            /六亲[：:]([^。！？\n\r]+)/g,
            /五行[：:]([^。！？\n\r]+)/g,
            /生克[：:]([^。！？\n\r]+)/g,
            /干支[：:]([^。！？\n\r]+)/g,
            /节气[：:]([^。！？\n\r]+)/g,
            /时间[：:]([^。！？\n\r]+)/g,
            /方位[：:]([^。！？\n\r]+)/g,
            /数象[：:]([^。！？\n\r]+)/g
        ];
        
        // 提取卦象信息
        let guaInfo = [];
        let remainingText = cleanText;
        
        guaPatterns.forEach(pattern => {
            const matches = [...cleanText.matchAll(pattern)];
            matches.forEach(match => {
                if (match[1]) {
                    guaInfo.push(match[0].trim());
                }
            });
        });
        
        // 提取卦名（如果有）
        const guaNamePatterns = [
            /乾卦/g, /坤卦/g, /屯卦/g, /蒙卦/g, /需卦/g, /讼卦/g, /师卦/g, /比卦/g,
            /小畜卦/g, /履卦/g, /泰卦/g, /否卦/g, /同人卦/g, /大有卦/g, /谦卦/g, /豫卦/g,
            /随卦/g, /蛊卦/g, /临卦/g, /观卦/g, /噬嗑卦/g, /贲卦/g, /剥卦/g, /复卦/g,
            /无妄卦/g, /大畜卦/g, /颐卦/g, /大过卦/g, /坎卦/g, /离卦/g, /咸卦/g, /恒卦/g,
            /遁卦/g, /大壮卦/g, /晋卦/g, /明夷卦/g, /家人卦/g, /睽卦/g, /蹇卦/g, /解卦/g,
            /损卦/g, /益卦/g, /夬卦/g, /姤卦/g, /萃卦/g, /升卦/g, /困卦/g, /井卦/g,
            /革卦/g, /鼎卦/g, /震卦/g, /艮卦/g, /渐卦/g, /归妹卦/g, /丰卦/g, /旅卦/g,
            /巽卦/g, /兑卦/g, /涣卦/g, /节卦/g, /中孚卦/g, /小过卦/g, /既济卦/g, /未济卦/g
        ];
        
        let detectedGuaName = '';
        guaNamePatterns.forEach(pattern => {
            const match = cleanText.match(pattern);
            if (match && !detectedGuaName) {
                detectedGuaName = match[0];
            }
        });
        
        // 提取实际内容（去掉卦象标签后的内容）
        let contentText = cleanText;
        guaPatterns.forEach(pattern => {
            contentText = contentText.replace(pattern, '');
        });
        
        // 生成解读内容
        let interpretation = this.generatePlumBlossomInterpretation(cleanText, detectedGuaName);
        
        // 构建完整的分栏显示格式
        let formattedOutput = '';
        
        // 添加卦象名称（如果有）
        if (detectedGuaName) {
            formattedOutput += `<div class="gua-header">【${detectedGuaName}】</div>`;
        }
        
        // 分栏容器开始
        formattedOutput += `<div class="gua-container">`;
        
        // 左栏：卦象信息
        formattedOutput += `<div class="gua-info-column">`;
        formattedOutput += `<div class="column-title">卦象信息</div>`;
        
        if (guaInfo.length > 0) {
            guaInfo.forEach(info => {
                formattedOutput += `<div class="gua-info-item">${info}</div>`;
            });
        } else {
            formattedOutput += `<div class="gua-info-item">卦象信息待补充</div>`;
        }
        formattedOutput += `</div>`;
        
        // 右栏：解读内容
        formattedOutput += `<div class="interpretation-column">`;
        formattedOutput += `<div class="column-title">卦象解读</div>`;
        formattedOutput += `<div class="interpretation-text">${interpretation}</div>`;
        formattedOutput += `</div>`;
        
        // 分栏容器结束
        formattedOutput += `</div>`;
        
        // 如果原始内容还有剩余，添加到附加信息栏
        if (contentText && contentText.length > 20) {
            // 清理内容文本，移除空的卦象信息
            contentText = contentText.replace(/^[：:\s\n]+/, '').trim();
            if (contentText && !contentText.includes('卦象解读')) {
                formattedOutput += `<div class="additional-info">`;
                formattedOutput += `<div class="column-title">补充说明</div>`;
                formattedOutput += `<div class="additional-text">${contentText}</div>`;
                formattedOutput += `</div>`;
            }
        }
        
        return formattedOutput;
     },

    generatePlumBlossomInterpretation: function(text, guaName) {
        // 基于内容生成100字左右的详细解读
        const interpretations = [
            '此卦显示时机成熟，百事皆顺，宜把握机遇积极行动。在前行的路上，需要保持内心的平静与坚定，不能急躁冒进。成功的关键在于审时度势，量力而行。坚持以诚待人，以德服人，必能获得理想的成果与收获。无论面对什么挑战，都要保持乐观的心态，相信自己的判断力和行动力，在稳步前进中实现目标。',
            '卦象呈现和谐稳定的趋势，预示着当前正是积累实力、厚积薄发的重要时期。多与他人合作交流，汲取各方智慧，贵人相助将为你指引方向。在此期间，应专注于自我提升，完善能力，为将来的成功打下坚实基础。保持谦逊学习的态度，尊重他人，善用团队的力量。通过团结协作，必能化解当前困境，迎来新的发展机遇和希望。',
            '此卦预示变化即将到来，象征着旧的格局将被打破，新的机遇将涌现。需要保持敏锐的洞察力，及时发现变化中的商机。勇敢地面对挑战，不要因为害怕未知而裹足不前。转变固有的思维模式，用全新的视角审视问题。创新思维和行动力将是你突破困境的关键。在变化中寻找机遇，在挑战中发现成长的阶梯，必然能获得意想不到的收获和发展。',
            '象征智慧与包容的卦象，预示着你需要用温和、智慧的方式处理各种事务。以德报怨，以仁治恶，用宽容的心对待他人和困难。保持内心的善良和包容力，这将成为你最强大的武器。通过慈善和智慧的行为，将赢得更多人的支持和帮助。在处理复杂问题时，要善于运用计谋和策略，但始终要保持本心的纯善。只有以德行天下，才能长久地获得成功和幸福。',
            '此卦显示创新的力量正在觉醒，象征着你需要突破传统思维的束缚，勇敢地走出一条属于自己的道路。要敢于质疑既有规则，善于提出新想法和解决方案。通过不断学习新知识，提升自身能力，用实际行动证明自己的价值。在这个过程中，可能会遇到质疑和阻力，但只要你坚持正确的方向，就必定会获得认可和成功。创新不是一蹴而就的，需要持之以恒的努力和坚定的信念。',
            '卦象呈现渐进式的成长规律，预示着任何成功都需要时间的积累和耐心的坚持。每一步都要稳扎稳打，不能急于求成。量变的积累终会引发质变的突破，只要保持耐心和毅力，就必定能看到成功的曙光。在这个过程中，要学会从失败中汲取经验，从成功中总结规律。坚持不是盲目的重复，而是有目标、有计划的前进。通过持续的自我完善和能力提升，终将达到理想的境界。',
            '此卦强调沟通交流的重要性，真诚的交流能够化解误会，建立信任，达成共识。在人际交往中，要善于表达自己的想法和情感，同时也要学会倾听他人的意见。多站在对方的角度思考问题，理解他人的难处和感受。建立互信关系将为你的事业发展打开更多机遇之门。良好的沟通不仅能解决当前的问题，还能预防未来可能出现的矛盾。以诚待人，以理服人，以情感人，你的人际关系将变得更加和谐美好。',
            '象征机遇与好运的卦象显示，只要你善于发现并把握身边的可能性，就能迎来转机和成功。保持乐观积极的心态，将各种困难和挑战视为成长的阶梯。不必为暂时的挫折而沮丧，因为每一次经历都是珍贵的财富。在机遇面前，要果断决策，勇敢行动。良好的心态是吸引好运的重要因素，同时也要有足够的准备和实力去迎接机遇的降临。相信自己，积极向上，好运必将伴随在你的左右。',
            '此卦显示内在的力量正在觉醒和爆发，要相信自己的能力、智慧和判断力。通过不断的反思总结，完善自我认知，将迎来人生新的发展阶段和高度。这是一个自我觉醒和成长的重要时期，要敢于面对内心的真实想法和情感。在自我提升的过程中，可能会经历一些痛苦和挣扎，但这些都是成长所必需的。通过不断的学习、思考和实践，你将发现一个更加强大、更加智慧的内在自我。',
            '卦象呈现平衡与和谐的特质，建议你在处理事务时保持中庸之道，不偏不倚，不急不躁。找到事物之间的平衡点，用和谐的方式解决问题。保持内心的平静和外在的温和，以柔克刚，以静制动。不偏执，不极端，用包容和理解的心态面对所有的挑战和机遇。平衡的智慧不仅能帮你处理好当前的问题，还能为你建立和谐的人际关系，营造良好的生活环境。通过持之以恒的平衡修炼，你将达到人生的理想境界。'
        ];
        
        // 如果有卦名，基于卦名添加特定解读
        if (guaName) {
            const guaInterpretations = {
                '乾卦': '乾为天，象征刚健向上的力量。此卦启示要保持积极进取的精神，坚持原则，勇于担当，终将有所成就。',
                '坤卦': '坤为地，代表包容与承载。此卦教导要善用柔德，厚德载物，以谦逊包容的心态待人接物，必有厚报。',
                '泰卦': '泰为通达，象征阴阳调和。此卦显示当前运势顺畅，把握良机，积极行动将获得理想的成果。',
                '谦卦': '谦为美德，代表谦逊谨慎。此卦启示要保持低调谦逊，虚心学习，谦受益满招损，德行将为你赢得尊重。',
                '震卦': '震为雷，象征惊醒与激励。此卦启示要抓住机遇，及时行动，勇敢面对挑战将带来意想不到的收获。',
                '巽卦': '巽为风，代表顺应与渗透。此卦显示要善用智慧，因势利导，温和而坚定的态度将帮你达成目标。'
            };
            
            if (guaInterpretations[guaName]) {
                return guaInterpretations[guaName];
            }
        }
        
        // 分析文本内容来选择合适的解读
        const textAnalysis = this.analyzeTextForInterpretation(text);
        
        // 根据文本分析结果选择最合适的解读
        if (textAnalysis.includes('变化') || textAnalysis.includes('变')) {
            return interpretations[2]; // 变化卦
        } else if (textAnalysis.includes('合作') || textAnalysis.includes('助')) {
            return interpretations[1]; // 合作卦
        } else if (textAnalysis.includes('智慧') || textAnalysis.includes('智')) {
            return interpretations[3]; // 智慧卦
        } else if (textAnalysis.includes('创新') || textAnalysis.includes('新')) {
            return interpretations[4]; // 创新卦
        } else if (textAnalysis.includes('坚持') || textAnalysis.includes('恒')) {
            return interpretations[5]; // 坚持卦
        } else if (textAnalysis.includes('沟通') || textAnalysis.includes('言')) {
            return interpretations[6]; // 沟通卦
        } else if (textAnalysis.includes('机遇') || textAnalysis.includes('机')) {
            return interpretations[7]; // 机遇卦
        } else if (textAnalysis.includes('内在') || textAnalysis.includes('心')) {
            return interpretations[8]; // 内在卦
        } else if (textAnalysis.includes('平衡') || textAnalysis.includes('和')) {
            return interpretations[9]; // 平衡卦
        }
        
        // 默认返回随机选择的一个解读
        return interpretations[Math.floor(Math.random() * interpretations.length)];
    },

    analyzeTextForInterpretation: function(text) {
        // 分析文本中的关键词，用于选择合适的解读
        const keywords = [
            '变化', '变', '转化', '转变',
            '合作', '助', '协助', '团结',
            '智慧', '智', '谋略', '计划',
            '创新', '新', '突破', '变革',
            '坚持', '恒', '持久', '耐心',
            '沟通', '言', '交流', '表达',
            '机遇', '机', '时机', '机会',
            '内在', '心', '内心', '自省',
            '平衡', '和', '和谐', '协调'
        ];
        
        let matchedKeywords = [];
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                matchedKeywords.push(keyword);
            }
        });
        
        return matchedKeywords.join(' ');
    },
    
    // 切换收藏状态
    toggleCollection: function() {
        // 确保collections属性存在
        if (!this.collections) {
            this.collections = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.COLLECTIONS) || '[]');
        }
        
        // 构建当前记录的标识（问题+启示的组合）
        const recordIdentifier = (this.currentQuestion || '') + '|' + (this.currentRevelation || '');
        
        // 检查是否已收藏
        const existingIndex = this.collections.findIndex(item => 
            item.question === this.currentQuestion && item.answer === this.currentRevelation
        );
        
        if (existingIndex > -1) {
            // 取消收藏
            this.collections.splice(existingIndex, 1);
            this.collectBtn.classList.remove('collected');
            this.showToast('已取消收藏');
        } else {
            // 添加收藏
            const newCollection = {
                id: Date.now().toString(),
                question: this.currentQuestion || '',
                answer: this.currentRevelation || '',
                time: new Date().toLocaleString(),
                scene: this.currentScene || 'daily',
                type: (this.currentQuestion && this.currentQuestion.startsWith('梅花易数预测')) ? '梅花易数' : '感应答案',
                timestamp: Date.now()
            };
            this.collections.push(newCollection);
            this.collectBtn.classList.add('collected');
            this.showToast('收藏成功');
        }
        
        // 保存到本地存储
        this.saveCollectionsToStorage();
    },
    
    // 更新收藏按钮状态
    updateCollectionButtonState: function() {
        // 确保使用类属性中的collections
        if (!this.collections) {
            this.loadCollectionsFromStorage();
        }
        
        const isCollected = this.collections.some(item => 
            item.question === this.currentQuestion && item.answer === this.currentRevelation
        );
        
        if (isCollected) {
            this.collectBtn.classList.add('collected');
        } else {
            this.collectBtn.classList.remove('collected');
        }
    },
    
    // 加载本地存储的数据
    loadStoredData: function() {
        // 加载用户信息
        this.loadUserInfoFromStorage();
        
        // 加载收藏列表
        this.loadCollectionsFromStorage();
        
        // 加载最后一次提问
        this.loadLastQuestionFromStorage();
    },
    
    // 保存用户信息到本地存储
    saveUserInfoToStorage: function(userInfo) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
        } catch (error) {
            console.error('保存用户信息失败:', error);
        }
    },
    
    // 从本地存储加载用户信息
    loadUserInfoFromStorage: function() {
        try {
            const userInfoStr = localStorage.getItem(this.STORAGE_KEYS.USER_INFO);
            if (userInfoStr) {
                this.userInfo = JSON.parse(userInfoStr);
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
        }
    },
    
    // 保存提问信息到本地存储
    saveQuestionToStorage: function(scene, question) {
        try {
            const questionData = {
                scene: scene,
                question: question,
                timestamp: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEYS.LAST_QUESTION, JSON.stringify(questionData));
        } catch (error) {
            console.error('保存提问信息失败:', error);
        }
    },
    
    // 从本地存储加载最后一次提问
    loadLastQuestionFromStorage: function() {
        try {
            const questionStr = localStorage.getItem(this.STORAGE_KEYS.LAST_QUESTION);
            if (questionStr) {
                const questionData = JSON.parse(questionStr);
                // 可以在这里使用这些数据，例如预填充到输入框
                // 如果需要，可以在场景选择后将问题自动填充到输入框
            }
        } catch (error) {
            console.error('加载提问信息失败:', error);
        }
    },
    
    // 保存收藏列表到本地存储
    saveCollectionsToStorage: function() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.COLLECTIONS, JSON.stringify(this.collections));
        } catch (error) {
            console.error('保存收藏失败:', error);
        }
    },
    
    // 从本地存储加载收藏列表
    loadCollectionsFromStorage: function() {
        try {
            const collectionsStr = localStorage.getItem(this.STORAGE_KEYS.COLLECTIONS);
            this.collections = collectionsStr ? JSON.parse(collectionsStr) : [];
        } catch (error) {
            console.error('加载收藏失败:', error);
            this.collections = [];
        }
    },
    
    // 返回场景选择
    goToSceneSelection: function() {
        this.hideRevelationModule();
        this.showSceneModule();
    },
    
    // 显示小知识
    showKnowledge: function() {
        alert('本启示源自传统智慧：取舍间自有平衡');
    },
    
    // 显示解锁提示
    showUnlockPrompt: function() {
        alert('付费功能暂未开放');
    },
    
    // 显示收藏列表
    showCollections: function() {
        // 确保使用类属性中的collections
        if (!this.collections) {
            this.loadCollectionsFromStorage();
        }
        
        this.collectionsContent.style.display = 'block';
        this.collectionsList.innerHTML = '';
        
        if (this.collections.length === 0) {
            const noCollections = document.createElement('div');
            noCollections.className = 'no-collections';
            noCollections.textContent = '暂无收藏';
            this.collectionsList.appendChild(noCollections);
            return;
        }
        
        // 倒序显示（最新的在前）
        this.collections.slice().reverse().forEach(item => {
            const collectionItem = document.createElement('div');
            collectionItem.className = 'collection-item';
            
            const content = document.createElement('div');
            content.className = 'content';
            content.textContent = item.content;
            
            const time = document.createElement('div');
            time.className = 'time';
            time.textContent = item.time;
            
            const sceneMap = {
                job: '职场选择',
                love: '情感关系',
                daily: '日常琐事'
            };
            
            const sceneInfo = document.createElement('div');
            sceneInfo.className = 'scene-info';
            sceneInfo.textContent = sceneMap[item.scene] || item.scene;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                this.deleteCollection(item.id);
            });
            
            collectionItem.appendChild(content);
            collectionItem.appendChild(sceneInfo);
            collectionItem.appendChild(time);
            collectionItem.appendChild(deleteBtn);
            
            this.collectionsList.appendChild(collectionItem);
        });
    },
    
    // 删除收藏
    deleteCollection: function(id) {
        this.collections = this.collections.filter(item => item.id !== id);
        this.saveCollectionsToStorage();
        this.showCollections();
        this.showToast('删除成功');
    },
    
    // 显示付费记录（Demo版）
    showOrders: function() {
        alert('暂无付费记录');
    },
    
    // 显示关于产品
    showAbout: function() {
        alert('轻量决策助手，提供温暖启示与思考角度');
    },
    
    // 显示轻提示
    showToast: function(message) {
        // 检查是否已存在toast元素
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // ============ 顶部用户界面功能 ============
    
    // 处理用户中心按钮点击
    handleUserCenterClick: function() {
        // 检查是否已有显示的状态
        const isPanelVisible = this.quickActionsPanel.classList.contains('show');
        
        if (isPanelVisible) {
            this.hideQuickActionsPanel();
        } else {
            this.showQuickActionsPanel();
        }
    },
    
    // 显示快速操作面板
    showQuickActionsPanel: function() {
        this.quickActionsPanel.classList.add('show');
        // 隐藏通知气泡（模拟已读）
        this.notificationBubble.style.display = 'none';
    },
    
    // 隐藏快速操作面板
    hideQuickActionsPanel: function() {
        this.quickActionsPanel.classList.remove('show');
    },
    
    // 保存到历史记录
    saveToHistory: function() {
        try {
            // 从localStorage加载现有历史记录
            let historyData = [];
            try {
                const historyStr = localStorage.getItem('app_history');
                if (historyStr) {
                    historyData = JSON.parse(historyStr);
                }
            } catch (error) {
                console.error('读取历史记录失败:', error);
            }
            
            // 构建历史记录对象
            const isPlumBlossom = this.currentQuestion && this.currentQuestion.startsWith('梅花易数预测');
            const record = {
                id: Date.now(),
                type: isPlumBlossom ? '梅花易数' : '感应答案',
                question: this.currentQuestion || '',
                answer: this.currentRevelation || '',
                time: new Date().toLocaleString(),
                scene: this.currentScene || 'daily',
                timestamp: Date.now()
            };
            
            // 如果是梅花易数，添加额外信息
            if (isPlumBlossom && this.plumBlossomData) {
                record.randomNumber = this.plumBlossomData.randomNumber || '';
                record.eventTime = this.plumBlossomData.time || '';
            }
            
            // 添加到历史记录开头
            historyData.unshift(record);
            
            // 限制历史记录数量（最多保留100条）
            if (historyData.length > 100) {
                historyData = historyData.slice(0, 100);
            }
            
            // 保存到localStorage
            localStorage.setItem('app_history', JSON.stringify(historyData));
            
            console.log('历史记录已保存:', record);
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    },
    
    // 显示历史记录
    showHistory: function() {
        // 跳转到独立的历史页面
        window.location.href = 'history.html';
    },
    
    // 显示帮助页面
    showHelp: function() {
        const help = `使用帮助\n\n• 点击场景卡片开始决策\n• 梅花易数功能提供数字占卜\n• 齿轮数字可点击调节\n• 收藏功能保存您的重要启示\n• 个人中心查看历史记录\n\n如有问题，请联系客服`;
        alert(help);
    },
    
    // 初始化用户界面状态
    initUserInterface: function() {
        // 监听点击外部区域隐藏面板
        document.addEventListener('click', (e) => {
            const isClickInsideUI = e.target.closest('.top-user-interface');
            if (!isClickInsideUI && this.quickActionsPanel.classList.contains('show')) {
                this.hideQuickActionsPanel();
            }
        });
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});