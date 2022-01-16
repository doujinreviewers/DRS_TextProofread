import escapeHtml from 'escape-html';
import diff from 'fast-diff';

export function formatResult(location, result, pretext){
  let formatted = {location:location, text: pretext, suggestion:""}
  formatted.suggestion = pretext.slice(0, result.messages[0].fix.range[0]) + result.messages[0].fix.text + pretext.slice(result.messages[0].fix.range[1]);
  let pre = "";
  let sug = "";
  let clean = diff(escapeHtml(formatted.text), escapeHtml(formatted.suggestion));
  clean.forEach(c => {
    if(c[0] === diff.EQUAL){
      pre += c[1]
      sug += c[1]
    }else if(c[0] === diff.INSERT){
      sug+='<span class="text-blue-600 underline decoration-solid">'+c[1]+'</span>'
    }else{
      pre+='<span class="text-red-600 underline decoration-solid">'+c[1]+'</span>'
    }
  });
  formatted.text = pre;
  formatted.suggestion = sug;
  return formatted
}

export class Engine {
  constructor(targets) {
    this.targets = targets;
    this.queue = [];

    this.fs = nw.require('fs');
    this.path = nw.require('path');
    this.data_dir = this.path.join(process.cwd(), 'data');
  }

  next(){
    if(this.queue.length == 0){
      if(this.targets.length != 0){
        this.parser(this.targets.shift());
      }else{
        return "EOF"
      }
    }
    return this.queue.shift();
  }

  parser(filename){
    let json = JSON.parse(this.fs.readFileSync(this.path.join(this.data_dir, filename)));
    switch (filename) {
      case 'Actors.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "アクター"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.profile
            })
          }
        });
        break;
      case 'Armors.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "防具"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.description
            })
          }
        });
        break;
      case 'Classes.json':
      case 'Enemies.json':
        let name = (filename == 'Classes.json') ? '職業' : '敵キャラ'
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: name+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.note
            })
          }
        });
        break;
      case 'CommonEvents.json':
        json.forEach(d => {
          if(d){
            let textflg = false;
            let text = "";
            d.list.forEach((l, i) =>{
              if(l.code == 101){
                textflg = true
              }
              if(l.code == 401){
                text += l.parameters[0]+'\r\n'
              }else if(l.code == 102){
                l.parameters[0].forEach(select_text =>{
                  text += select_text+'\r\n'
                })
              }
              if(text && (d.list.length == i || (textflg && l.code != 401) || l.code == 102)){
                this.queue.push({
                  location: "コモンイベント"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0'),
                  text: text
                })
                text = "";
                textflg = false;
              }
            })
          }
        });
        break;
      case 'Items.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "アイテム"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.description+'\r\n'+d.note
            })
          }
        });
        break;
      case 'MapInfos.json':
        json.forEach(d => {
          if(d){
            let mapname = "マップ"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name;
            let eventname = "";
            let pageinfo = "";
            
            let map_json = JSON.parse(this.fs.readFileSync(this.path.join(this.data_dir, `Map${d.id.toString().padStart(3, '0')}.json`)));
            map_json.events.forEach(event => {
              if(event){
                eventname = event.id.toString().padStart(3, '0')+" "+event.name;
                event.pages.forEach((page, i) => {
                  pageinfo = `-${i+1}ページ目`;
                  let textflg = false;
                  let text = "";
                  page.list.forEach((l, i) => {
                    if(l.code == 101){
                      textflg = true
                    }
                    if(l.code == 401){
                      text += l.parameters[0]+'\r\n'
                    }else if(l.code == 102){
                      l.parameters[0].forEach(select_text =>{
                        text += select_text+'\r\n'
                      })
                    }
                    if(text && (page.list.length == i || (textflg && l.code != 401) || l.code == 102)){
                      this.queue.push({
                        location: mapname+'\r\n'+eventname+'\r\n'+pageinfo,
                        text: text
                      })
                      text = "";
                      textflg = false;
                    }
                  })
                })
              }
            })
          }
        });
        break;
      case 'Skills.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "スキル"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.description+'\r\n'+d.message1+'\r\n'+d.message2+'\r\n'+d.note
            })
          }
        });
        break;
      case 'States.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "ステート"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.message1+'\r\n'+d.message2+'\r\n'+d.message3+'\r\n'+d.message4+'\r\n'+d.note
            })
          }
        });
        break;
      case 'System.json':
        json.armorTypes.forEach((armor, i) => {
          this.queue.push({
            location:"システム"+'\r\n'+"防具タイプ",
            text: i.toString().padStart(3, '0')+" "+armor
          })
        })
        json.elements.forEach((element, i) => {
          this.queue.push({
            location:"システム"+'\r\n'+"属性",
            text: i.toString().padStart(3, '0')+" "+element
          })
        })
        json.equipTypes.forEach((equip, i) => {
          this.queue.push({
            location:"システム"+'\r\n'+"装備タイプ",
            text: i.toString().padStart(3, '0')+" "+equip
          })
        })
        json.skillTypes.forEach((skill, i) => {
          this.queue.push({
            location:"システム"+'\r\n'+"スキルタイプ",
            text: i.toString().padStart(3, '0')+" "+skill
          })
        })
        json.weaponTypes.forEach((weapon, i) => {
          this.queue.push({
            location:"システム"+'\r\n'+"武器タイプ",
            text: i.toString().padStart(3, '0')+" "+weapon
          })
        })
        break;
      case 'Troops.json':
        json.forEach(d => {
          if(d){
            d.pages.forEach((page, i) => {
              let pageinfo = `-${i+1}ページ目`+'\r\n'
              let textflg = false;
              let text = "";
              page.list.forEach((l, i) => {
                if(l.code == 101){
                  textflg = true
                }
                if(l.code == 401){
                  text += l.parameters[0]+'\r\n'
                }else if(l.code == 102){
                  l.parameters[0].forEach(select_text =>{
                    text += select_text+'\r\n'
                  })
                }
                if(text && (page.list.length == i || (textflg && l.code != 401) || l.code == 102)){
                  this.queue.push({
                    location: "敵グループ"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name+'\r\n'+pageinfo,
                    text: text
                  })
                  text = "";
                  textflg = false;
                }
              })
            })
          }
        });
        break;
      case 'Weapons.json':
        json.forEach(d => {
          if(d){
            this.queue.push({
              location: "武器"+'\r\n'+"ID:"+d.id.toString().padStart(4, '0')+" "+d.name,
              text: d.description+'\r\n'+d.note
            })
          }
        });
        break;
    }
  }

}