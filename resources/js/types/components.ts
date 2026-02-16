import { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    icon?: React.ComponentType<IconProps>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

export interface FormInputProps {
    label?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    icon?: React.ComponentType<IconProps>;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
    disabled?: boolean;
    className?: string;
}

export interface FormSelectProps {
    label?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

export interface FormTextareaProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export interface FormCheckboxProps {
    label?: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message?: string;
    onClose?: () => void;
    children?: React.ReactNode;
}

export interface BadgeProps {
    variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
    children: React.ReactNode;
    className?: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    links: PaginationLink[];
}

export interface DataTableColumn<T = any> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface DataTableProps<T = any> {
    columns: DataTableColumn<T>[];
    rows: T[];
    onSort?: (key: string) => void;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    emptyMessage?: string;
}
