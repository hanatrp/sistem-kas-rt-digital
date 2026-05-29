import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md-custom border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 shadow-sm focus:border-secondary focus:ring-secondary dark:focus:border-secondary dark:focus:ring-secondary ' +
                className
            }
            ref={localRef}
        />
    );
});
