import React, {useState} from "react";

export function BooleanContext(props: {
    initial?: boolean,
    children: (bool: boolean, setBool: ((value: (((prevState: boolean) => boolean) | boolean)) => void)) => JSX.Element
}): JSX.Element {
    const [bool, setBool]: [boolean, ((value: (((prevState: boolean) => boolean) | boolean)) => void)] = useState<boolean>(props.initial ?? false)
    return (
        <>{props.children(bool, setBool)}</>
    )
}
