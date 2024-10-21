
export function addClickEvent2Tab(human_tab_elm: HTMLElement): void {
    // タブに対してクリックイベントを適用
    const tabs = human_tab_elm.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    human_tab_elm.addEventListener('click', tabSwitch, false);
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', tabSwitch, false);
    }
    // タブ識別用にdata属性を追加
    const num = message_box_manager.message_box_list.length;
    human_tab_elm.setAttribute('data-tab_num', num.toString());
    // メッセージボックスのサイズが変更された時のイベントを追加
    const message_box_elm = human_tab_elm.getElementsByClassName("messageText")[0] as HTMLElement;
    const front_name = (human_tab_elm.getElementsByClassName("human_name")[0] as HTMLElement).innerText;
    const message_box = new MessageBox(message_box_elm, message_box_manager, num, human_tab_elm);
}