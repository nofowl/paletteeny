import React from "react"

interface Props {
    tooltip: string
}

export class TooltipButton extends React.Component<Props & React.HTMLAttributes<HTMLButtonElement>, {}> {
    render() {
        return (
        <button {...this.props}>
            <span className="Tooltip-text">{this.props.tooltip}</span>
            {this.props.children}
        </button>
    )
    }
}