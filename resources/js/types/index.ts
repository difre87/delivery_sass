export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    current_company_id: number | null;
    created_at: string;
    updated_at: string;
    currentCompany?: Company;
}

export interface Company {
    id: number;
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
    tax_number: string | null;
    registration_number: string | null;
    logo_path: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Branch {
    id: number;
    company_id: number;
    name: string;
    code: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: number;
    company_id: number;
    name: string;
    code: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Driver {
    id: number;
    company_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    license_number: string | null;
    license_type: string | null;
    license_expiry: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    id: number;
    company_id: number;
    registration: string;
    make: string | null;
    model: string | null;
    year: number | null;
    type: string | null;
    capacity_kg: number | null;
    capacity_m3: number | null;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Shipment {
    id: number;
    company_id: number;
    client_id: number | null;
    driver_id: number | null;
    vehicle_id: number | null;
    tracking_number: string | null;
    pickup_address: string | null;
    pickup_city: string | null;
    pickup_postal_code: string | null;
    pickup_date: string | null;
    delivery_address: string | null;
    delivery_city: string | null;
    delivery_postal_code: string | null;
    delivery_date: string | null;
    status: string;
    cost_cents: number | null;
    price_cents: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    client?: Client;
    driver?: Driver;
    vehicle?: Vehicle;
}

export interface FuelLog {
    id: number;
    company_id: number;
    vehicle_id: number;
    driver_id: number | null;
    date: string;
    liters: number;
    amount_cents: number;
    price_per_liter_cents: number | null;
    odometer: number | null;
    station: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    vehicle?: Vehicle;
    driver?: Driver;
}

export interface Invoice {
    id: number;
    company_id: number;
    client_id: number;
    invoice_number: string;
    invoice_date: string;
    due_date: string | null;
    subtotal_cents: number;
    tax_cents: number;
    total_amount_cents: number;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    client?: Client;
    items?: InvoiceItem[];
}

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    description: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
    created_at: string;
    updated_at: string;
}

export interface Waybill {
    id: number;
    company_id: number;
    client_id: number | null;
    driver_id: number | null;
    waybill_number: string;
    date: string;
    status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    client?: Client;
    driver?: Driver;
    items?: WaybillItem[];
}

export interface WaybillItem {
    id: number;
    waybill_id: number;
    description: string;
    quantity: number;
    weight_kg: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price_cents: number;
    currency: string;
    interval: string;
    trial_days: number;
    max_drivers: number | null;
    max_vehicles: number | null;
    max_shipments_per_month: number | null;
    features: Record<string, any>;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: number;
    company_id: number;
    plan_id: number;
    status: string;
    trial_ends_at: string | null;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    plan?: Plan;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface FlashMessage {
    status?: string;
    error?: string;
    success?: string;
    message?: string;
}

export interface Permissions {
    canAccessSettings: boolean;
    canManageUsers: boolean;
    canManageBranches: boolean;
    canManageCompanySettings: boolean;
    canManageDrivers: boolean;
    canManageFleet: boolean;
    canManageRoutes: boolean;
    canManageClients: boolean;
    canViewShipments: boolean;
    canManageShipments: boolean;
    canAccessAnalytics: boolean;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        currentCompany?: Company;
    };
    permissions?: Permissions;
    flash?: FlashMessage;
    errors?: Record<string, string>;
    ziggy?: {
        location: string;
        query: Record<string, string>;
    };
};
