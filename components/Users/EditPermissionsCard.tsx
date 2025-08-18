"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import * as Tooltip from "@radix-ui/react-tooltip";
import { apiService, Permission } from "@/lib/api-service";

interface Props {
  permissions: { [key: string]: boolean };
  setPermissions: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

export function EditPermissionsCard({ permissions, setPermissions }: Props) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    apiService.getAllPermissions().then((res) => setAllPermissions(res));
  }, []);

  const toggle = (name: string) => {
    setPermissions({ ...permissions, [name]: !permissions[name] });
  };

  const grouped: { [category: string]: Permission[] } = {};
  allPermissions.forEach((perm) => {
    if (!grouped[perm.category]) grouped[perm.category] = [];
    grouped[perm.category].push(perm);
  });

  const permissionDescriptions: { [key: string]: string } = {
    view_products: "Allows the user to view products",
    create_products: "Allows the user to create new products",
    edit_products: "Allows the user to edit existing products",
    delete_products: "Allows the user to delete products",
    view_brands: "Allows the user to view brands",
    create_brands: "Allows the user to create new brands",
    edit_brands: "Allows the user to edit existing brands",
    delete_brands: "Allows the user to delete brands",
    view_item_types: "Allows the user to view item types",
    create_item_types: "Allows the user to create item types",
    edit_item_types: "Allows the user to edit item types",
    delete_item_types: "Allows the user to delete item types",
  };

  const categoryDescriptions: { [key: string]: string } = {
    products: "Give permissions for product module",
    brands: "Give permissions for brand module",
    "item types": "Give permissions for item type module",
    general: "General permissions",
  };

  return (
    <Tooltip.Provider>
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Assign permissions to this user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([category, perms]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-semibold">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <p className="text-sm text-gray-500">
                  {categoryDescriptions[category.toLowerCase()] ||
                    "Assign permissions for this module"}
                </p>
                <div className="flex flex-col gap-2">
                  {perms.map((perm) => (
                    <Tooltip.Root key={perm.name}>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={permissions[perm.name] ?? false}
                          onChange={() => toggle(perm.name)}
                        />
                        <Tooltip.Trigger asChild>
                          <span className="no-underline">{perm.label}</span>
                        </Tooltip.Trigger>
                      </label>

                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          align="center"
                          sideOffset={4}
                          className="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg z-50"
                        >
                          {permissionDescriptions[perm.name] || perm.label}
                          <Tooltip.Arrow
                            className="fill-gray-800"
                            offset={10}
                          />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Tooltip.Provider>
  );
}
