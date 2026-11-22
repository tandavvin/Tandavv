import {
    permissionGroups,
    allPermissions,
} from "../constants/permissions";
import { ShieldCheck, Lock } from "lucide-react";


const Permissions = () => {
    const totalPermissions = allPermissions.length;

    return (
        <div className="space-y-7">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Permission Management
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Review and manage the permissions available across Tandav.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Permission Categories
                        </p>

                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                        {permissionGroups.length}
                    </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Total Permissions
                        </p>

                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Lock size={20} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-4">
                        {totalPermissions}
                    </h2>
                </div>

            </div>

            {/* Permission Groups */}
            <div>
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Available Permissions
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        These permissions can be assigned to Sub Admin accounts.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                    {permissionGroups.map((group) => {
                        const Icon = group.icon;

                        return (
                            <section
                                key={group.title}
                                className="bg-white border border-gray-200 rounded-2xl p-5"
                            >

                                <div className="flex items-center gap-3 mb-5">

                                    <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                        <Icon size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {group.title}
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {group.description}
                                        </p>
                                    </div>

                                    <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                        {group.permissions.length} permissions
                                    </span>

                                </div>

                                <div className="space-y-2">

                                    {group.permissions.map((permission) => (
                                        <div
                                            key={permission}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                                        >
                                            <span className="text-sm text-gray-700">
                                                {permission}
                                            </span>

                                            <ShieldCheck
                                                size={17}
                                                className="text-green-600"
                                            />
                                        </div>
                                    ))}

                                </div>

                            </section>
                        );
                    })}

                </div>
            </div>

            {/* Information */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        size={20}
                        className="text-orange-600 mt-0.5"
                    />

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Permission Security
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                            Permission assignments must be verified by the backend.
                            Hiding a menu item in the frontend is not sufficient
                            to protect platform resources.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Permissions;
