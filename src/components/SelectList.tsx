import { ChangeEvent, Component, ReactNode } from "react";
import { ConvManLabel } from ".";
import { ISelectListItem } from "./interfaces/ISelectListItem";

interface ISelectListProps {
  items: Array<ISelectListItem>;
  label: string;
  onListboxChange(newValue: any): void;
}

interface ISelectListState {
  selectedItem: any;
}

export default class SelectList extends Component<ISelectListProps, ISelectListState> {
  constructor(props: ISelectListProps) {
    super(props);
    this.state = { selectedItem: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: ChangeEvent<HTMLSelectElement>): void {
    this.setState({ selectedItem: e.target.value });
    this.props.onListboxChange(e.target.value);
  }

  render(): ReactNode {
    return (
      <div className="flex-none md:flex">
        <ConvManLabel label={this.props.label}></ConvManLabel>
        <div className="flex-1">
          <select onChange={this.handleChange} name="select_me" className="rounded-xl w-full p-3">
            {this.props.items.map((item: ISelectListItem, idx: number) => {
              return (
                <option key={idx} value={item.value}>
                  {item.option}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}
