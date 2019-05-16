import * as React from 'react';

import { triggerAsyncId } from 'async_hooks';
import './ModalDialog.css';

// Declaration of the component as React Class Component
class IconPicker extends React.Component<any, any> {

    icons: any = {};

    selectedItem: string;

    itemSelected(e: any) {
        this.selectedItem = e.value;
    }

    constructor(props: any) {
        super(props);
        this.selectedItem = this.props.onChangeValue;
        this.icons.asterisk = {name: 'asterisk', title: 'Asterisk', code: '&#x2a;'};
        this.icons.plus = {name: 'plus', title: 'Plus', code: '&#x2b;'};
        this.icons.euro = {name: 'euro', title: 'Euro', code: '&#x20ac;'};
        this.icons.minus = {name: 'minus', title: 'Minus', code: '&#x2212;'};

        this.itemSelected = this.itemSelected.bind(this);
    }

    render() {

        const options: JSX.Element[] = [];
        let cls: string;
        for (const opt of Object.keys(this.icons)) {
            cls = 'glyphicon glyphicon-' + this.icons[opt].name + ' icon-picker-icon';
            options.push(<li onClick={(e) => {this.selectedItem = e.currentTarget.innerText; }}>
                            <span className={cls}></span>
                            {this.icons[opt].name}
                        </li>);
        }

        return (
            <div className="btn-group">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    Select icon <span className="caret"></span>
                </button>
            <ul className="dropdown-menu" role="menu">
                {options}
            </ul>
        </div>

        );

        // <select className="modal-dialog-select" data-show-icon="true" onChange={(e) => {this.itemSelected; }}>
        //    {options}
        // </select>
  }
}

// Export the component to use it in other components.
export default IconPicker;
