import {Grid} from "./Grid";

export function Main() {
    return (
        <Grid props={{ onClick: event => { /* ... */ }}} gTC={"repeat(2, 1fr)"}>

        </Grid>
    );
}
