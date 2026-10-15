// ========= 任务1：原版寻宝代码基础；任务2新增谜题情节，Promise异步封装 =========
class TreasureMap {
    // 1.寻找线索
    static getInitialClue() {
        return new Promise(resolve => {
            setTimeout(() => resolve("🔮线索出现：在古老的图书馆找到了第一条线索"), 1000);
        });
    }
    // 2.解码古文
    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) reject("线索丢失，无法解读古文！");
                resolve("🔥解码完成：破译古文，宝藏藏在远古神庙深处");
            }, 1500);
        });
    }
    // 3.【新增情节】石门谜题（任务2新增异步任务）
    static solveStoneRiddle() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const rand = Math.random();
                if (rand < 0.3) reject("谜题答错！石门紧闭，探险失败");
                resolve("🟢谜题通过：机关转动，神庙石门缓缓开启");
            }, 1200);
        });
    }
    // 4.神庙探索，遭遇守卫
    static exploreTemple() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const rand = Math.random();
                if (rand < 0.5) reject("守卫发现了你，探险终止！");
                resolve("🟡守卫离开：成功避开神庙守卫，发现黄金宝箱");
            }, 2000);
        });
    }
    //5.开启宝箱
    static openTreasureChest() {
        return new Promise(resolve => {
            setTimeout(() => resolve("🔴宝藏获得：恭喜！成功拿到传说中的远古宝藏！"), 1000);
        });
    }
}

//DOM元素
const logContainer = document.getElementById("logContainer");
const chestDom = document.getElementById("chest");
const startBtn = document.getElementById("startGame");
const flowBox = document.getElementById("flowBox");
const dots = [
    document.getElementById("dot0"),
    document.getElementById("dot1"),
    document.getElementById("dot2"),
    document.getElementById("dot3"),
    document.getElementById("dot4")
];
const labels = [
    document.getElementById("lab0"),
    document.getElementById("lab1"),
    document.getElementById("lab2"),
    document.getElementById("lab3"),
    document.getElementById("lab4")
];
const sceneIcons = document.querySelectorAll(".icon-item");

//日志添加
function appendLog(text, type) {
    const div = document.createElement("div");
    div.className = `log-row log-${type}`;
    div.innerText = text;
    logContainer.appendChild(div);
    logContainer.scrollTop = logContainer.scrollHeight;
}

//重置所有状态
function resetAllUI() {
    logContainer.innerHTML = "";
    chestDom.classList.remove("glow");
    dots.forEach(d => d.classList.remove("active", "fail"));
    labels.forEach(l => l.classList.remove("active"));
    sceneIcons.forEach(icon => icon.classList.remove("active"));
    flowBox.innerHTML = "";
}

//点亮左侧步骤节点
function activateNode(index, isFail = false) {
    if(isFail){
        dots[index].classList.add("fail");
    }else{
        dots[index].classList.add("active");
        labels[index].classList.add("active");
        if(sceneIcons[index]) sceneIcons[index].classList.add("active");
    }
}

//绘制底部流程图节点
function drawFlow(color){
    const node = document.createElement("div");
    node.className = "flow-node";
    node.style.background = color;
    flowBox.appendChild(node);
    const arrow = document.createElement("span");
    arrow.className = "flow-arrow";
    arrow.textContent = "→";
    flowBox.appendChild(arrow);
}

// =========任务3 async/await重写寻宝主流程=========
async function runTreasureHunt() {
    startBtn.disabled = true;
    resetAllUI();
    try {
        //步骤1
        appendLog("正在搜寻古老线索...", "wait");
        const clueMsg = await TreasureMap.getInitialClue();
        activateNode(0);
        drawFlow("#28a745");
        appendLog(clueMsg, "success");

        //步骤2
        appendLog("解读石壁古文...", "wait");
        const decodeMsg = await TreasureMap.decodeAncientScript(clueMsg);
        activateNode(1);
        drawFlow("#ffc107");
        appendLog(decodeMsg, "success");

        //步骤3 新增谜题情节
        appendLog("尝试破解石门机关谜题...", "wait");
        const puzzleMsg = await TreasureMap.solveStoneRiddle();
        activateNode(2);
        drawFlow("#28c968");
        appendLog(puzzleMsg, "success");

        //步骤4
        appendLog("进入神庙大厅探索，小心守卫...", "wait");
        const templeMsg = await TreasureMap.exploreTemple();
        activateNode(3);
        drawFlow("#ffb326");
        appendLog(templeMsg, "success");

        //步骤5
        appendLog("开启黄金宝箱...", "wait");
        const treasureMsg = await TreasureMap.openTreasureChest();
        activateNode(4);
        drawFlow("#dc3545");
        chestDom.classList.add("glow");
        appendLog(treasureMsg, "success");
    } catch (err) {
        //捕获异常，标记失败节点
        const failIdx = logContainer.querySelectorAll(".log-wait").length;
        if(dots[failIdx]) activateNode(failIdx, true);
        drawFlow("#772222");
        appendLog("探险失败：" + err, "error");
    } finally {
        startBtn.disabled = false;
    }
}

startBtn.onclick = runTreasureHunt;
