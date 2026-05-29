export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-secondary shadow-sm focus:ring-secondary ' +
                className
            }
        />
    );
}
