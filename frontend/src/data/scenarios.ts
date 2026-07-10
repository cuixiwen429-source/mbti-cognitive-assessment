/**
 * Immersive story-based MBTI assessment scenarios.
 * 5 chapters, 28 decisions, 112 option paths — all mapping to 8 cognitive functions.
 *
 * Structure: Each decision has 4 options, each option contributes weighted
 * scores to 2-3 cognitive functions. Across 28 decisions, the cumulative
 * scores naturally profile the user's cognitive preferences.
 */
import type { StoryChapter } from '../types';

export const STORY_CHAPTERS: StoryChapter[] = [
  /* ═══════════════════ CHAPTER 1: 迷雾森林 ═══════════════════ */
  {
    id: 1,
    title: '迷雾森林',
    subtitle: '感知 · 你如何观察这个世界',
    scene: '浓雾笼罩着古老的森林。你脚下的苔藓柔软潮湿，空气中弥漫着松针和泥土的气息。你不知道自己是怎么来到这里的，但你知道必须往前走。前方的雾气中，隐约有什么在闪烁……',
    gradient: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    icon: '🌲',
    decisions: [
      {
        id: 'ch1_d1',
        context: '你沿着若隐若现的小路前行。路旁的灌木丛中传来一阵细碎的声响，像是什么小动物在移动。一束微光从树枝间洒下，照亮了前方三样东西。',
        question: '你最先注意到什么？',
        options: [
          { text: '路边一块形状奇特的石头，它的纹理像是在讲述什么', subtext: '被其独特的细节吸引', functions: { Se: 4, Si: 2 } },
          { text: '树梢间透出的光线角度，似乎在暗示某个方向', subtext: '感知其中的规律和指引', functions: { Ni: 4, Ne: 2 } },
          { text: '远处传来的一阵若有若无的钟声', subtext: '对声音的来源和含义感到好奇', functions: { Ne: 4, Ni: 2 } },
          { text: '小时候在祖母家后院也有一片类似的树林', subtext: '勾起了温暖的童年回忆', functions: { Si: 4, Fi: 2 } },
        ],
      },
      {
        id: 'ch1_d2',
        context: '雾越来越浓了。你能感觉到这条路在分岔——左边似乎是一条被踩实的土路，右边则是一道铺满落叶的小径。',
        question: '你怎么选择该走哪条路？',
        options: [
          { text: '蹲下来仔细观察两条路的地面痕迹', subtext: '收集具体的物理线索', functions: { Se: 3, Ti: 3 } },
          { text: '闭上眼睛感受风向和坡度', subtext: '用直觉感知环境的整体走向', functions: { Ni: 3, Se: 2, Fi: 2 } },
          { text: '回想过去野外徒步的经验来判断', subtext: '调用脑海中的经验和知识', functions: { Si: 4, Te: 2 } },
          { text: '每条路都先试着走一小段，看看感觉如何', subtext: '用实际体验代替猜测', functions: { Se: 3, Ne: 3 } },
        ],
      },
      {
        id: 'ch1_d3',
        context: '你走了一段路，发现一棵巨大的古树横在路中央。树干上刻满了古老的符号。有些符号看起来很新，像是最近才刻上去的。',
        question: '你如何理解这些符号？',
        options: [
          { text: '试图在脑海中拼凑出一个完整的故事——这些符号在说什么？', subtext: '寻找内在的逻辑和含义', functions: { Ni: 4, Ti: 3 } },
          { text: '仔细观察符号的刻痕深度和磨损程度', subtext: '从物理细节推断时间和工具', functions: { Se: 3, Si: 2, Te: 2 } },
          { text: '联想到你曾在某本书里见过类似的标记系统', subtext: '连接已有的知识储备', functions: { Si: 3, Ne: 3 } },
          { text: '觉得这些符号很美，用手机拍下来想之后慢慢研究', subtext: '被其美感打动，引发情感共鸣', functions: { Fi: 3, Se: 3 } },
        ],
      },
      {
        id: 'ch1_d4',
        context: '雾终于开始变薄。你走出密林，发现眼前是一片开阔的草地。草地上散落着一些物件——一本旧日记、一把生锈的钥匙、一个指南针、还有一张泛黄的地图。',
        question: '你会先拿起哪一样？',
        options: [
          { text: '地图——先搞清楚全局地形和方向', subtext: '需要建立整体认知框架', functions: { Ni: 3, Te: 3 } },
          { text: '旧日记——想通过他人的记录来了解这个地方', subtext: '从他人的经验中获取信息', functions: { Si: 3, Fe: 3 } },
          { text: '指南针——先确定基本方位，然后实地探索', subtext: '用工具和行动来确认现实', functions: { Te: 3, Se: 3 } },
          { text: '钥匙——直觉告诉我这把钥匙很重要', subtext: '跟着内心的感觉走', functions: { Ni: 3, Fi: 3 } },
        ],
      },
      {
        id: 'ch1_d5',
        context: '你在草地上发现了一些足迹。它们看起来像是人类的脚印，但步伐的间距和深度有些奇怪。足迹一直延伸到远处的一条碎石路上。',
        question: '你根据什么来决定要不要跟随这些足迹？',
        options: [
          { text: '分析足迹的物理特征——步幅、深度、方向', subtext: '用逻辑推理判断是否安全', functions: { Ti: 3, Se: 3 } },
          { text: '跟着直觉——如果你感觉这是对的，那就是对的', subtext: '信任内在的指引', functions: { Ni: 3, Fi: 3 } },
          { text: '考虑如果有人需要帮助，你有责任去看看', subtext: '从道德责任的角度思考', functions: { Fe: 3, Fi: 2, Te: 2 } },
          { text: '先制定一个计划——跟多久、遇到什么情况该回头', subtext: '用系统化的方式管理风险', functions: { Te: 3, Si: 3 } },
        ],
      },
    ],
  },

  /* ═══════════════════ CHAPTER 2: 岔路口 ═══════════════════ */
  {
    id: 2,
    title: '岔路口',
    subtitle: '抉择 · 你如何做出判断',
    scene: '草地尽头，三条岔路在你面前展开。左边是通往山谷的蜿蜒小道，石阶上布满青苔。中间是一座摇摇晃晃的吊桥，横跨在深不见底的峡谷之上。右边则是一道陡峭的石梯，通向云雾缭绕的高处。每一条路都意味着完全不同的旅程。',
    gradient: 'from-[#2d1b69] via-[#5b2c6f] to-[#1a1a2e]',
    icon: '⚡',
    decisions: [
      {
        id: 'ch2_d1',
        context: '三条路摆在面前。山谷小径看起来安全但耗时，吊桥看起来危险但可能最快，石梯陡峭但视野可能最开阔。',
        question: '你用什么标准来选择道路？',
        options: [
          { text: '快速分析每条路的利弊和成功率', subtext: '用逻辑构建决策模型', functions: { Ti: 4, Te: 2 } },
          { text: '问问自己：哪种选择最能让你成长？', subtext: '以个人价值和成长为出发点', functions: { Fi: 4, Ni: 2 } },
          { text: '权衡安全与效率——哪个选项风险最可控？', subtext: '系统性评估可行性和后果', functions: { Te: 4, Si: 2 } },
          { text: '想象每条路尽头的景象，选择最让你心动的那一个', subtext: '用想象力和直觉来探索可能', functions: { Ne: 4, Fi: 2 } },
        ],
      },
      {
        id: 'ch2_d2',
        context: '你决定走吊桥。桥在风中摇晃得厉害，木板发出嘎吱的声响。走到一半时，你发现前方有两块木板已经断裂，露出一个缺口。对面有一捆绳索。',
        question: '你怎么过这个缺口？',
        options: [
          { text: '目测缺口的距离，然后直接跳过去', subtext: '相信自己的身体判断和即时反应', functions: { Se: 4, Ti: 2 } },
          { text: '先用绳子做一个安全结，再谨慎地跨过去', subtext: '系统性解决——先确保安全再行动', functions: { Te: 3, Si: 3 } },
          { text: '仔细观察绳索的磨损程度和承重能力', subtext: '先收集关键数据再决定', functions: { Ti: 3, Se: 2, Si: 2 } },
          { text: '停下来重新评估——有没有更好的路线？', subtext: '退一步，寻找替代方案', functions: { Ne: 3, Ni: 3 } },
        ],
      },
      {
        id: 'ch2_d3',
        context: '过了桥，你遇到一位老人坐在路边。他面前摆着一张石桌，上面有三个倒扣的杯子。他说：「选一个杯子，里面的东西会影响你的旅程。但我不会告诉你里面是什么。」',
        question: '你如何选择？',
        options: [
          { text: '问老人一些问题，从回答中寻找线索', subtext: '通过沟通获取信息', functions: { Fe: 3, Ne: 2, Ti: 2 } },
          { text: '随便选一个——最终都会学到一些东西', subtext: '接受不确定性，相信过程', functions: { Ne: 3, Fi: 3 } },
          { text: '分析杯子的摆放位置和老人的微表情', subtext: '用细节观察来辅助决策', functions: { Se: 3, Ti: 3 } },
          { text: '决定不选——不想让随机因素影响你的旅程', subtext: '坚持自主和掌控', functions: { Te: 3, Ni: 3 } },
        ],
      },
      {
        id: 'ch2_d4',
        context: '老人微笑着看你做出选择，然后说：「很多人路过这里，大多数人都选错了。但"错"也不一定是坏事。」他的话让你陷入沉思。',
        question: '老人说「错不一定是坏事」——你怎么理解这句话？',
        options: [
          { text: '每个选择都会带来不同的经历和成长', subtext: '从发展性视角理解', functions: { Ne: 3, Fi: 3 } },
          { text: '他在说——所谓"对错"只是视角问题', subtext: '从相对主义角度理解', functions: { Ni: 3, Ti: 2, Fi: 2 } },
          { text: '这是安慰人的话——但现实中有些选择确实比另一些更好', subtext: '保持务实和理性的判断', functions: { Te: 3, Si: 3 } },
          { text: '老人可能经历过很多，才得出这样的人生智慧', subtext: '从人情世故的角度共情', functions: { Fe: 3, Si: 2, Fi: 2 } },
        ],
      },
      {
        id: 'ch2_d5',
        context: '天快黑了。你需要在夜幕完全降临之前找到今晚的落脚处。远处有几点灯火，看起来像是一个小村庄。但通往村庄的路被一片沼泽挡住了。沼泽旁立着一块警示牌，但上面的字已经模糊不清。',
        question: '面对不确定的危险，你怎么做？',
        options: [
          { text: '找一个长树枝试探沼泽的深浅和结实程度', subtext: '用工具和方法来减少不确定性', functions: { Te: 3, Se: 3 } },
          { text: '绕沼泽走一圈，看看有没有更安全的路径', subtext: '探索替代方案而非冒险', functions: { Ne: 3, Si: 3 } },
          { text: '相信自己的脚感和反应速度，慢慢走过去', subtext: '信任当下的感官判断和适应力', functions: { Se: 3, Ti: 2, Fi: 2 } },
          { text: '站在原地感受一下——直觉会告诉你这条路是否安全', subtext: '依赖内在的警报系统', functions: { Ni: 4, Fi: 2 } },
        ],
      },
    ],
  },

  /* ═══════════════════ CHAPTER 3: 断桥困境 ═══════════════════ */
  {
    id: 3,
    title: '断桥困境',
    subtitle: '应变 · 你如何面对危机',
    scene: '村庄比你想象的要荒凉。大部分房屋已经废弃，只有一间小屋透出微弱的烛光。就在你走向小屋的途中，地面突然剧烈震动——远处传来山石崩塌的巨响。回头一看，你来时的路已经被碎石堵住了。更糟糕的是，村里的古井开始涌出浑浊的水，水位正在快速上升。',
    gradient: 'from-[#0b0f19] via-[#1a1f2e] to-[#2d1f3d]',
    icon: '🌊',
    decisions: [
      {
        id: 'ch3_d1',
        context: '水位在快速上升。你只有几分钟的时间来做出反应。村民们还需要被叫醒和疏散。你的心跳加快了。',
        question: '你的第一个动作是什么？',
        options: [
          { text: '迅速评估环境——找到最高点和最安全的撤离路线', subtext: '快速分析形势，找到关键信息', functions: { Se: 2, Ti: 2, Te: 3 } },
          { text: '立刻跑去敲每家的门，确保所有人都知道危险', subtext: '首先考虑他人的安全', functions: { Fe: 4, Se: 2 } },
          { text: '深呼吸让自己冷静，然后制定一个清晰的疏散计划', subtext: '先稳住自己，再系统行动', functions: { Te: 3, Ni: 2, Si: 2 } },
          { text: '注意到水中有漩涡——判断地下可能有暗河连通', subtext: '洞察到环境中的隐藏模式', functions: { Ni: 3, Ti: 3 } },
        ],
      },
      {
        id: 'ch3_d2',
        context: '你发现一位老人被困在远处的屋顶上。水已经漫过了房子的地基。你需要尽快过去，但水流湍急。',
        question: '你怎么过去救人？',
        options: [
          { text: '找附近的木板或漂浮物，快速搭建一个简易浮桥', subtext: '动手制作工具解决实际问题', functions: { Se: 3, Te: 3 } },
          { text: '环顾四周寻找是否有绳索或梯子可以利用', subtext: '系统性寻找物资再行动', functions: { Si: 3, Te: 3 } },
          { text: '评估水流速度——也许有一条相对安全的水路', subtext: '分析物理条件后找到最优路径', functions: { Ti: 3, Se: 2, Ni: 2 } },
          { text: '大声指挥附近其他年轻人一起帮忙', subtext: '协调团队力量来解决问题', functions: { Fe: 3, Te: 3 } },
        ],
      },
      {
        id: 'ch3_d3',
        context: '老人被安全救出后，告诉你在村子东边有一个古老的水闸，打开它就能把水引向山谷。但去水闸的路已经被碎石掩埋了一半，而且天已经完全黑了。',
        question: '你怎么找到并打开水闸？',
        options: [
          { text: '让老人详细描述路线，画一个简易地图再出发', subtext: '依赖经验和规划', functions: { Si: 3, Te: 3 } },
          { text: '带上一根棍子和一盏灯，边走边探查路面', subtext: '用实时感官信息导航', functions: { Se: 4, Ti: 2 } },
          { text: '相信自己的方向感——大概方向对了就能找到', subtext: '信任内在导航系统', functions: { Ni: 3, Se: 2, Fi: 2 } },
          { text: '找几个村民一起——人多可以分头找', subtext: '通过组织和分工来提升效率', functions: { Te: 3, Fe: 3 } },
        ],
      },
      {
        id: 'ch3_d4',
        context: '水闸在最后一刻被打开了。洪水退去，村庄保住了。村民们都围了过来向你表达感谢。村长说：「你救了我们的村子。我们可以满足你一个请求。」',
        question: '你希望得到什么？',
        options: [
          { text: '关于这片土地的秘密和历史——我想理解这里的一切', subtext: '追求知识和深层理解', functions: { Ni: 3, Ti: 3 } },
          { text: '一段安静的休息时光和一个温暖的地方', subtext: '需要恢复和整理自己', functions: { Si: 3, Fi: 3 } },
          { text: '村民们今后互帮互助的承诺——这比什么都重要', subtext: '关注社区和关系的长期价值', functions: { Fe: 4, Fi: 2 } },
          { text: '一张这片区域的完整地图和继续前行的物资', subtext: '务实——继续推进旅程', functions: { Te: 3, Se: 2, Ni: 2 } },
        ],
      },
      {
        id: 'ch3_d5',
        context: '风波平息。你坐在村口的石头上，看着星空。刚刚的经历让你对自己的应对方式有了新的认识。一个小孩走过来，递给你一朵还在滴着露水的野花。',
        question: '回看刚才的危机处理，你最大的感触是什么？',
        options: [
          { text: '在最危急的时候，清晰的逻辑是最大的依靠', subtext: '认可理性思考的价值', functions: { Ti: 4, Te: 2 } },
          { text: '大家一起努力的力量让我感动', subtext: '被人与人之间的连接所打动', functions: { Fe: 3, Fi: 3 } },
          { text: '人的本能反应比我想象的可靠', subtext: '对身体反应和直觉的信任', functions: { Se: 3, Ni: 3 } },
          { text: '如果有更好的预案，也许危机可以处理得更轻松', subtext: '从经验中学习，思考改进', functions: { Si: 3, Te: 3 } },
        ],
      },
      // Attention check: embedded in the story
      {
        id: 'ch3_d6',
        context: '第二天早上，村长交给你一个密封的信封，说这是上一个旅行者留下的。信封上写着：「如果你认真读到了这里，请选择第三个选项——这不是为了测试你，而是为了确保你能听到我想说的。」',
        question: '你怎么做？',
        options: [
          { text: '第一个选项', subtext: '', functions: {} },
          { text: '第二个选项', subtext: '', functions: {} },
          { text: '按信上说的，选第三个选项', subtext: '', functions: {} },
          { text: '第四个选项', subtext: '', functions: {} },
        ],
      },
    ],
    hasAttentionCheck: true,
    attentionExpectedOption: 2,
    attentionDecisionIndex: 5,
  },

  /* ═══════════════════ CHAPTER 4: 旅人相逢 ═══════════════════ */
  {
    id: 4,
    title: '旅人相逢',
    subtitle: '羁绊 · 你如何与他人连接',
    scene: '告别了村庄，你继续踏上旅程。在一个山口，你遇到了另外三个旅行者——他们也同样迷失在这片神秘的土地上。天色已晚，你们决定在篝火旁一起过夜。火焰在黑暗中跳动，映照着每个人的脸庞。',
    gradient: 'from-[#3a1c47] via-[#5b2c2c] to-[#1a0a0e]',
    icon: '🔥',
    decisions: [
      {
        id: 'ch4_d1',
        context: '篝火旁，四个人围坐。一个沉默的年轻人盯着火焰出神，一个健谈的中年女人在讲她旅途中的趣事，一个背满装备的老人在安静地整理行囊。',
        question: '你在这个小团体中自然地扮演什么角色？',
        options: [
          { text: '接过话头，把中年女人的故事引向更深的讨论', subtext: '促进交流，连接大家', functions: { Fe: 4, Ne: 2 } },
          { text: '注意那个沉默的年轻人——他似乎有什么心事', subtext: '关注被忽略的个体', functions: { Fi: 3, Fe: 2, Ni: 2 } },
          { text: '开始梳理目前大家掌握的信息——也许我们可以拼凑出这片土地的真相', subtext: '组织信息，寻找线索', functions: { Te: 3, Ti: 3 } },
          { text: '安静地观察每个人的互动，在心里构建对他们的理解', subtext: '作为观察者而非参与者', functions: { Ni: 3, Ti: 2, Fi: 2 } },
        ],
      },
      {
        id: 'ch4_d2',
        context: '中年女人提议：「我们结伴走吧！人多更安全，也更热闹。」但那个年轻人犹豫了——他似乎更习惯独行。老人则不置可否。',
        question: '对于「结伴还是独行」，你的立场是什么？',
        options: [
          { text: '支持结伴——集体的智慧和力量能克服更多困难', subtext: '相信合作的力量', functions: { Fe: 3, Te: 3 } },
          { text: '理解年轻人的犹豫——有时候独自前行更适合深思', subtext: '尊重个体差异和自主性', functions: { Fi: 3, Ni: 3 } },
          { text: '建议先一起走一段试试，效果好再决定', subtext: '务实的渐进式方案', functions: { Te: 3, Se: 2, Si: 2 } },
          { text: '觉得「结伴或独行」取决于目的地——先搞清楚大家的目标是否一致', subtext: '从根本逻辑出发', functions: { Ti: 3, Ni: 3 } },
        ],
      },
      {
        id: 'ch4_d3',
        context: '大家开始分享各自的「来到这里的故事」。每个人的经历都截然不同。轮到你了。',
        question: '你怎么讲述你的故事？',
        options: [
          { text: '按照时间的顺序，事无巨细地讲述每一段经历', subtext: '注重细节和完整性', functions: { Si: 4, Te: 2 } },
          { text: '讲述那些最有感触的瞬间，以及它们带给你的改变', subtext: '以情感成长为线索', functions: { Fi: 4, Fe: 2 } },
          { text: '提炼出几条核心的感悟和教训——这些可能是对大家最有用的', subtext: '以洞察和总结为主线', functions: { Ni: 3, Te: 3 } },
          { text: '配合手势和模仿，让故事更生动有趣', subtext: '用生动的表达吸引听众', functions: { Se: 3, Fe: 3 } },
        ],
      },
      {
        id: 'ch4_d4',
        context: '夜深了。年轻人突然说出了一件困扰他的事——他总觉得有人一直在跟着他，但他从未看到过那个人。中年女人觉得他多虑了，老人则建议他换一条路走。',
        question: '你怎么看待年轻人的担忧？',
        options: [
          { text: '认真听他说——有时候被真正倾听本身就是一种帮助', subtext: '提供情感支持而非解决方案', functions: { Fe: 3, Fi: 3 } },
          { text: '帮他分析是否有实际的证据支持他的感觉', subtext: '用逻辑分析来确认或排除', functions: { Ti: 3, Te: 2, Se: 2 } },
          { text: '他可能敏锐地察觉到了我们都没有注意到的东西', subtext: '认真对待直觉的可能性', functions: { Ni: 3, Fi: 2, Ne: 2 } },
          { text: '建议明天大家多留意周围环境，互相照应', subtext: '制定具体的风险应对方案', functions: { Te: 3, Si: 2, Fe: 2 } },
        ],
      },
      {
        id: 'ch4_d5',
        context: '天亮前，老人分享了他一路上的见闻。「我在这片土地上走了很久，」他说，「我发现每个旅行者最终都会到达他内心最深处想去的地方——不管他走了多少弯路。」',
        question: '你怎么理解老人的话？',
        options: [
          { text: '内心最深处的渴望确实会塑造你的人生轨迹', subtext: '认同内在动力的重要性', functions: { Fi: 4, Ni: 2 } },
          { text: '这是幸存者偏差——失败的人没有机会说这话', subtext: '用批判性思维审视', functions: { Ti: 3, Te: 3 } },
          { text: '不管是不是真的，相信这句话会让旅途更有意义', subtext: '从实际心理效果的角度', functions: { Fe: 3, Ne: 2, Si: 2 } },
          { text: '那我要更认真地走每一步——因为每一步都在定义我的终点', subtext: '从当下的行动角度理解', functions: { Se: 3, Te: 2, Fi: 2 } },
        ],
      },
      {
        id: 'ch4_d6',
        context: '清晨的第一缕阳光洒在每个人的脸上。你们四个旅行者围坐在篝火的余烬旁，沉默中却有一种奇异的默契。即将各自上路了。',
        question: '离别之时，你最想对大家说什么？',
        options: [
          { text: '「谢谢你们的陪伴——我会记住这一晚。」', subtext: '表达感恩和珍惜连接', functions: { Fe: 3, Si: 3 } },
          { text: '「也许我们还会在某个地方再相遇。」', subtext: '对未来的可能保持开放', functions: { Ne: 3, Fe: 2, Fi: 2 } },
          { text: '「希望每个人的旅程都能找到属于自己的意义。」', subtext: '从深层价值层面祝福', functions: { Fi: 3, Ni: 3 } },
          { text: '不说什么——一个真诚的眼神和微笑就够了', subtext: '用行动和存在代替语言', functions: { Se: 3, Fi: 3 } },
        ],
      },
    ],
  },

  /* ═══════════════════ CHAPTER 5: 古塔之巅 ═══════════════════ */
  {
    id: 5,
    title: '古塔之巅',
    subtitle: '归宿 · 你内心的灯塔是什么',
    scene: '最后一段旅程将你带到了这座传说中的古塔。塔身由黑色岩石砌成，塔顶消失在云层之中。塔门敞开着，里面的螺旋楼梯似乎在邀请你上去。这里没有守卫，没有谜题——只有你，和那条向上的石阶。',
    gradient: 'from-[#1a0533] via-[#2d1b69] to-[#0f0c29]',
    icon: '🗼',
    decisions: [
      {
        id: 'ch5_d1',
        context: '螺旋楼梯很窄，只容一人通过。每走几步就有一个小窗口，从窗口可以看到不同高度的风景。有的人喜欢在低处的窗口流连，有的人则不回头地向上走。',
        question: '你怎么走这段楼梯？',
        options: [
          { text: '稳步向上——在每个窗口都停下来看看外面的风景', subtext: '享受过程，不急于到达终点', functions: { Se: 3, Si: 2, Fi: 2 } },
          { text: '直接登顶——我想看到最完整的景色', subtext: '目标明确，追求全景', functions: { Ni: 4, Te: 2 } },
          { text: '边走边思考——这座塔是谁建的？为什么要建？', subtext: '不断追问事物的本质', functions: { Ti: 3, Ni: 3 } },
          { text: '不时回头看看自己走了多远', subtext: '从回顾中获得成就感和方向', functions: { Si: 3, Fi: 2, Te: 2 } },
        ],
      },
      {
        id: 'ch5_d2',
        context: '走到一半时，你发现墙上刻着许多名字——之前的旅行者留下的。有些名字旁边还有简短的留言。旁边放着一块松动的石砖和一支古老的石笔。',
        question: '你会在墙上留下什么吗？',
        options: [
          { text: '留下你的名字，也许后来者看到会感到被鼓励', subtext: '为他人留下一些东西', functions: { Fe: 3, Si: 2, Fi: 2 } },
          { text: '写下一句话——关于你在这次旅程中学到的最重要的事', subtext: '提炼核心感悟并分享', functions: { Ni: 3, Fi: 3 } },
          { text: '仔细阅读其他人的留言——这比我自己写更有价值', subtext: '从他人的经验中学习', functions: { Si: 3, Fe: 3 } },
          { text: '不留下任何痕迹——让这个空间保持它原有的样子', subtext: '尊重事物的本来面目', functions: { Fi: 3, Se: 2, Ni: 2 } },
        ],
      },
      {
        id: 'ch5_d3',
        context: '终于到了塔顶。这里只有一个空旷的圆形房间，中央立着一面巨大的镜子。但这不是普通的镜子——镜中反映的不是你的外表，而是你内心最深处的样子。',
        question: '你期待在镜中看到什么？',
        options: [
          { text: '一个清晰的、充满自信的自己', subtext: '渴望看到坚定和有方向感的自我', functions: { Te: 3, Ni: 2, Fi: 2 } },
          { text: '一个被所爱之人围绕的自己', subtext: '核心价值在于与他人的连接', functions: { Fe: 4, Fi: 2 } },
          { text: '一个不断探索和成长的自己——不需要完美', subtext: '过程比结果更重要', functions: { Ne: 3, Fi: 3 } },
          { text: '真实的样子就好——无论是什么', subtext: '追求真实大于一切', functions: { Fi: 4, Se: 2 } },
        ],
      },
      {
        id: 'ch5_d4',
        context: '镜子里的影像慢慢变得清晰。你看到的不只是现在的你，还有你曾经是的、你想成为的。所有的矛盾、困惑和闪光点都在同一幅画面里。',
        question: '面对这个完整的自己，你最强烈的情感是什么？',
        options: [
          { text: '理解和接纳——这就是我', subtext: '与自我达成了和解', functions: { Fi: 4, Ni: 2 } },
          { text: '好奇——还有更多的东西等待去发现', subtext: '保持探索的欲望', functions: { Ne: 4, Ti: 2 } },
          { text: '感恩——这一路走来的每一步都塑造了今天的我', subtext: '感激经历，珍惜过程', functions: { Si: 3, Fe: 2, Fi: 2 } },
          { text: '决心——我要把在镜中看到的潜能变为现实', subtext: '将洞察转化为行动', functions: { Te: 3, Ni: 3 } },
        ],
      },
      {
        id: 'ch5_d5',
        context: '镜子旁有一扇小门。门外是向下的楼梯——这次旅程的终点，也是回到现实世界的通道。塔顶的风吹来，带着远方大海的气息。你知道，一旦走出这扇门，你的故事将永远不一样了。',
        question: '在离开前，你对自己许下一个什么承诺？',
        options: [
          { text: '更勇敢地信任自己的直觉和判断', subtext: '决心跟随内心的指引', functions: { Ni: 3, Fi: 3 } },
          { text: '更用心地感受每一个当下的瞬间', subtext: '承诺活在当下', functions: { Se: 3, Fi: 3 } },
          { text: '更主动地关心和连接身边的人', subtext: '承诺加深人际关系', functions: { Fe: 4, Si: 2 } },
          { text: '更有条理地规划和追求自己的目标', subtext: '承诺行动和执行', functions: { Te: 3, Si: 2, Ni: 2 } },
        ],
      },
      {
        id: 'ch5_d6',
        context: '你踏出古塔。阳光洒在脸上，眼前是广阔的天地。地平线上有无数条路在延伸。旅程结束了，但也是新的开始。',
        question: '回望这整段旅程，是什么一直在指引着你？',
        options: [
          { text: '对真理和理解的不懈追求', subtext: '你的灯塔是理性和知识', functions: { Ti: 4, Ni: 2 } },
          { text: '内心的价值观和对「做自己」的坚持', subtext: '你的灯塔是真实和信仰', functions: { Fi: 4, Ni: 2 } },
          { text: '对他人的关心和让世界更温暖的愿望', subtext: '你的灯塔是爱与连接', functions: { Fe: 4, Si: 2 } },
          { text: '脚踏实地、一步步把事情做好的务实精神', subtext: '你的灯塔是行动和成果', functions: { Te: 3, Se: 2, Si: 2 } },
        ],
      },
    ],
  },
];
