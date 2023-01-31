export const partialize: <T>(partial: Partial<T>) => Partial<T> = partial => partial;

export const as: <T>(t: T) => T = t => t;

/**
 * ALLOWED ALIASES FOR FLUENT / IMPROVED "ENGLISH" CODE READING
 */
export {
    as as identity
}
