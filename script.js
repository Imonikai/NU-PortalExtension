'use strict'

//配列の添字
const KAMOKU = 0;
const TANNI = 1;
const HYOKA = 2;
const RISYUCHU = 3;


window.addEventListener('load', main, false);

function main()
{
    console.log('NU-PortalExtensionが起動');

    const pageTitle = document.querySelector('.titleAreaL');
    
    if(pageTitle != null && pageTitle.textContent == '成績照会')
    {
        console.log('NU-PortalExtensionの動作対象ページです。');
    
        const dispRadio = document.querySelectorAll( '[name = "form1:htmlDispPtn"]');
        let dispRadioChecked;
    
        for( let i = 0; i < dispRadio.length; i++ )
        {
            if(dispRadio.item(i).checked)
            {
                dispRadioChecked = dispRadio.item(i).value;
            }
        }
    
        if(dispRadioChecked == 'tujyo')
        {
            //ここからメイン
            const kamokuList = document.querySelectorAll('.tdKamokuList');
            const taniList = document.querySelectorAll('.tdTaniList');
            const hyokaList = document.querySelectorAll('.tdHyokaList');
            const risyuList = document.querySelectorAll('.tdKamokuListRishuchu');
            let scoreList = [];
            let limit = kamokuList.length;
    
            for( let i = 0; i < limit; i++ )
            {
                scoreList.push([kamokuList[i].textContent, taniList[i].textContent, hyokaList[i].textContent, risyuList[i].textContent]);
            }
            const syutokuTable = createTable('取得済み単位', getSyutokuDict(scoreList), getDictKeys(scoreList));
            document.querySelector('.tblDispChk').after(syutokuTable);

            const risyuchuTable = createTable('履修中単位', getRisyuchuDict(scoreList), getDictKeys(scoreList));
            syutokuTable.after(risyuchuTable);

            let gpaElement = document.createElement('p');
            gpaElement.textContent = 'あなたのGPA:' + calcGpa(scoreList, 2);
            gpaElement.style.fontSize = '1.2em';
            risyuchuTable.after(gpaElement);
    
        }
        else
        {
            console.log('NU-PortalExtensionの動作対象ページではありませんでした。');
        }
    
    }
    else
    {
        console.log('NU-PortalExtensionの動作対象ページではありませんでした。');
    }
}

function getSyutokuDict(array)
{
    let i = 0;
    let target = '';
    let syutokuDict = new Object();
    while( i < array.length)
    {
        while(1)
        {
            if(array[i][KAMOKU].includes('（必修）') || array[i][KAMOKU].includes('（選択）') || array[i][KAMOKU].includes('専門教育科目'))
            {
                target = array[i][KAMOKU];
                syutokuDict[target] = 0;
                i++;
                break;
            }
            else if(target == '')
            {
                i++;
                break;
            }

            if(array[i][HYOKA] == 'S' || array[i][HYOKA] == 'A' || array[i][HYOKA] == 'B'|| array[i][HYOKA] == 'C')
            {
                syutokuDict[target] += Number(array[i][TANNI]);
            }
            i++;
            break;
        }
    }

    return syutokuDict;
}

function getRisyuchuDict(array)
{
    let i = 0;
    let target = '';
    let risyuchuDict = new Object();
    while( i < array.length)
    {
        while(1)
        {
            if(array[i][KAMOKU].includes('（必修）') || array[i][KAMOKU].includes('（選択）') || array[i][KAMOKU].includes('専門教育科目'))
            {
                target = array[i][KAMOKU];
                risyuchuDict[target] = 0;
                i++;
                break;
            }
            else if(target == '')
            {
                i++;
                break;
            }

            if(array[i][RISYUCHU] != '')
            {
                risyuchuDict[target] += Number(array[i][TANNI]);
            }
            i++;
            break;
        }
    }

    return risyuchuDict;
}


function calcGpa(array, fix)
{
    let tanniSum = 0;
    let hyokaSum = 0;

    for( let i = 0; i < array.length; i++ )
    {
        if(array[i][HYOKA] != '' && array[i][HYOKA] != 'P' && array[i][HYOKA] != 'N')
        {
            const tanni = Number(array[i][TANNI]);
            tanniSum += tanni;

            switch(array[i][HYOKA])
            {
                case 'S':
                    hyokaSum += tanni * 4;
                    break;
                case 'A':
                    hyokaSum += tanni * 3;
                    break;
                case 'B':
                    hyokaSum += tanni * 2;
                    break;
                case 'C':
                    hyokaSum += tanni * 1;
                    break;
            }
        }
    }
    return (hyokaSum/tanniSum).toFixed(fix);
}

function getDictKeys(array)
{
    let keys = [];
    for( let i = 0; i < array.length; i++ )
    {
        if(array[i][KAMOKU].includes('（必修）') || array[i][KAMOKU].includes('（選択）') || array[i][KAMOKU].includes('専門教育科目'))
        {
            keys.push(array[i][KAMOKU]);
        }
    }

    return keys;
}

function createTable(title,dict, keys)
{
    let table =  document.createElement('table');
    let tr = document.createElement('tr');
    let caption = document.createElement('caption');
    let sum = 0;

    caption.textContent = title;
    table.appendChild(caption);

    keys.forEach(key => {
        let th = document.createElement('th');
        th.textContent = key;
        tr.appendChild(th);
    });
    let sumTh = document.createElement('th');
    sumTh.textContent = '合計';
    tr.appendChild(sumTh);
    table.appendChild(tr);
    
    tr = document.createElement('tr');
    keys.forEach(key => {
        let td = document.createElement('td');
        td.textContent = dict[key];
        sum += Number(dict[key]);
        td.style.textAlign = 'center';
        td.style.border = 'solid 1px';
        tr.appendChild(td);
    })
    let sumTd = document.createElement('td');
    sumTd.textContent = sum;
    sumTd.style.textAlign = 'center';
    sumTd.style.border = 'solid 1px';
    tr.appendChild(sumTd);
    table.appendChild(tr);

    table.append(tr);

    return table;
}