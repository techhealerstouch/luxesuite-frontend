import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AuthenticatorProductDialog } from "@/components/Users/Authenticator/AuthenticatorProductDialog";
import {
  Eye,
  Download,
  FileText,
  Box,
  GitPullRequest,
  Cpu,
  Activity,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import { apiService } from "@/lib/api-service";
import { generateAuthenticationPDF } from "@/utils/pdf-generator";
import { ReferenceCodeDialog } from "@/components/ReferenceCodeDialog";

interface AuthenticatorProductsCardProps {
  userId: string;
}

const tabIcons: Record<string, any> = {
  serial_info: Box,
  documents: FileText,
  case_analysis: GitPullRequest,
  dial_analysis: Cpu,
  bracelet_analysis: Activity,
  movement_analysis: Cpu,
  performance_test: Activity,
};

export function LoadingSpinner({
  size = 8,
  color = "blue",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div className="flex justify-center py-6">
      <motion.div
        className={`w-${size} h-${size} border-4 border-t-${color}-500 border-gray-200 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

export function AuthenticatorProductsCard({
  userId,
}: AuthenticatorProductsCardProps) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refDialogOpen, setRefDialogOpen] = useState(false);
  const [selectedRefProduct, setSelectedRefProduct] = useState<any | null>(
    null
  );

  const handleDownloadPDF = (product: any) => {
    if (product) {
      generateAuthenticationPDF(product);
    }
  };

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    setLoading(true);

    const fetchProducts = async () => {
      try {
        const { data, meta } = await apiService.getAuthenticatedProducts(
          userId,
          page,
          search
        );
        if (isMounted) {
          setProducts(data);
          setMeta(meta);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
          setMeta({ current_page: 1, last_page: 1 });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [userId, page, search]);

  const openProductDialog = (product: any) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <Card className="shadow-xl rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Products</CardTitle>
        <CardDescription>
          Here are all the authenticated products created by this user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="max-w-xs"
          />
        </div>

        <div className="overflow-x-auto w-full">
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <p className="text-center py-6">No products found.</p>
          ) : (
            <Table className="min-w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Model #</TableHead>
                  <TableHead>Serial #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Authenticity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, idx) => (
                  <motion.tr
                    key={product.id ?? idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <TableCell>{product.serial_info?.model_number}</TableCell>
                    <TableCell>{product.serial_info?.serial_number}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.estimated_production_year}</TableCell>
                    <TableCell>{product.authenticity_verdict}</TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openProductDialog(product)}
                      >
                        <Eye />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadPDF(product)}
                      >
                        <Download />
                      </Button>

                      {product.nfc_link ? (
                        // If NFC link exists -> show Website (globe) icon button
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            window.open(product.nfc_link.url, "_blank")
                          }
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      ) : (
                        // Otherwise -> show Link button (open dialog)
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRefProduct(product);
                            setRefDialogOpen(true);
                          }}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end mt-4 items-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            &lt;&lt;
          </Button>
          <span className="font-semibold">{page}</span>
          <Button
            size="sm"
            variant="ghost"
            disabled={page === meta.last_page}
            onClick={() => setPage((prev) => prev + 1)}
          >
            &gt;&gt;
          </Button>
        </div>
      </CardContent>
      <ReferenceCodeDialog
        open={refDialogOpen}
        onOpenChange={setRefDialogOpen}
        authenticatedProductId={selectedRefProduct?.id ?? 0} // pass the ID
      />

      {/* Dialog */}
      <AuthenticatorProductDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Card>
  );
}

// Helper function to format keys nicely
function formatTitle(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
