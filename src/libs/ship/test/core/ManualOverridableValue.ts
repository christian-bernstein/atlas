export type ManualOverridableValue<T> = {
    autoValue: T,
    overwriteValue: T | undefined,
    overwrite: boolean
}

export function getValueFromOverridable<T>(mov: ManualOverridableValue<T> | undefined, def?: T | undefined): T | undefined {
    if (mov === undefined) {
        return def;
    }
    if (mov.overwrite) {
        return mov.overwriteValue!;
    } else {
        return mov.autoValue;
    }
}

export {
    getValueFromOverridable as getVFO
}
