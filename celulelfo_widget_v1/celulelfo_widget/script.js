let index;
let goal; 
let fieldData;
let userLocale;
let prevCount;
let timeout;


function getElement(id) {
    return document.getElementById(id);
}

function formatCurrency(value) {
    return Number(value).toLocaleString(userLocale, {
        style: 'currency', currency: 'BRL'
    });
}


function setGoal() {
    getElement('goal').textContent = formatCurrency(goal);
}


function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = `${Math.random() * 80}%`;
    sparkle.style.top = `${Math.random() * 90}%`;
    getElement('sparkles').appendChild(sparkle);

    sparkle.addEventListener('animationend', () => {
        sparkle.remove();
    });
}

function addSparkles(num) {
    for (let i = 0; i < num; i++) {
        setTimeout(createSparkle, i * 200);
    }
}

async function updateBar(count) {
    // console.clear();
    console.log(`count from ${prevCount} to ${count} on session index ${index}`);
    
    if (count === prevCount) return;
    clearTimeout(timeout);
    prevCount = count;
    count = Number(count) || 0;

    let percentage = Number((count / goal * 100).toPrecision(3)) || 0;
    percentage = Math.min(percentage, 100); 

    getElement('bar').style.height = percentage + '%';
    
    getElement('count').textContent = formatCurrency(count);

    addSparkles(10); // Adiciona sparkles quando a barra é atualizada
}

function startWidget(fieldData,sessionData) {
    console.clear();
    console.log("startWidget...");
    console.dir(sessionData);

    index = 'tip-' + (fieldData.eventPeriod || 'session');
    const initialTip = sessionData.data[index] ?? {};

    const count = sessionData && initialTip?
     initialTip.amount??0
    :
     0;
    
    console.dir(`count on start on [${index}]:${count}`);
    goal = Number(fieldData.goal) || 1;
    userLocale = fieldData.userLocale || 'pt-BR';
    
    getElement('title').textContent = fieldData.titleText || '';
    getElement('divider').textContent = fieldData.divider || '/';
    setGoal();
    updateBar(Number(count) || 0);
}

window.addEventListener('onWidgetLoad', async function (obj) {
    const fieldData = obj.detail.fieldData;
    const sessionData = obj.detail.session;

    goal = parseFloat(fieldData["goal"]);
    userLocale = fieldData["userLocale"];
    index = 'tip-' + fieldData['eventPeriod'];
   
    startWidget(fieldData,sessionData);
    console.dir(obj.detail);
});

window.addEventListener('onSessionUpdate', function (obj) {
    const session = obj.detail.session || {};
    console.dir(session);
    if (session[index]) {
        let count = session[index].amount;
        console.dir(session[index]);
        updateBar(count);
    }else console.error(`session[${index}] not found`);
});

window.addEventListener('onEventReceived', function (obj) {
    

});


const style = document.createElement('style');
style.innerHTML = `
    .sparkle {
    position: absolute;
    width: 48px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    /* background: #7fff00; */
    background: var(--bg-emote-elfofolove1);

    animation: sparkle 3s linear forwards;
}

  @keyframes sparkle {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px) scale(0);
    }
  }
`;
document.head.appendChild(style);
