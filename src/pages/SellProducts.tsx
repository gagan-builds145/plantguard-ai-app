import { AppShell } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { ALL_NURSERY_CATEGORIES, PRODUCT_UNITS } from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  Flower2,
  Image as ImageIcon,
  IndianRupee,
  Loader2,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Product = Doc<"products"> & { imageUrl: string | null };

const emptyForm = {
  name: "",
  category: "",
  price: "",
  unit: PRODUCT_UNITS[0],
  stock: "",
  description: "",
};

export default function SellProducts() {
  const products = useQuery(api.products.listProducts);
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const removeProduct = useMutation(api.products.removeProduct);
  const recordSaleMutation = useMutation(api.products.recordSale);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  const [saleQty, setSaleQty] = useState("1");
  const [saleBuyer, setSaleBuyer] = useState("");
  const [recording, setRecording] = useState(false);

  const listingCount = products?.length ?? 0;
  const totalStock = (products ?? []).reduce((sum, p) => sum + p.stock, 0);
  const catalogueValue = (products ?? []).reduce(
    (sum, p) => sum + p.stock * p.price,
    0,
  );

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      unit: product.unit,
      stock: String(product.stock),
      description: product.description,
    });
    setFile(null);
    setPreview(product.imageUrl);
    setFormOpen(true);
  }

  function pickFile(next: File | null) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  async function save() {
    if (form.name.trim().length < 2) {
      toast.error("Please enter a product name.");
      return;
    }
    if (!form.category) {
      toast.error("Please choose a category.");
      return;
    }
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    setSaving(true);
    try {
      let imageId: Id<"_storage"> | undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!response.ok) throw new Error("upload failed");
        imageId = ((await response.json()) as { storageId: Id<"_storage"> })
          .storageId;
      }

      if (editing) {
        await updateProduct({
          id: editing._id,
          name: form.name,
          category: form.category,
          price,
          unit: form.unit,
          stock: Number(form.stock) || 0,
          description: form.description,
          ...(imageId ? { imageId } : {}),
        });
        toast.success("Listing updated");
      } else {
        await createProduct({
          name: form.name,
          category: form.category,
          price,
          unit: form.unit,
          stock: Number(form.stock) || 0,
          description: form.description,
          imageId,
        });
        toast.success("Product listed");
      }
      setFormOpen(false);
    } catch {
      toast.error("Couldn't save this listing. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function recordSale() {
    if (!saleProduct) return;
    const qty = Math.floor(Number(saleQty));
    if (!Number.isFinite(qty) || qty < 1) {
      toast.error("Enter a quantity of at least 1.");
      return;
    }
    setRecording(true);
    try {
      await recordSaleMutation({
        productId: saleProduct._id,
        quantity: qty,
        buyer: saleBuyer.trim() || undefined,
      });
      toast.success("Sale recorded");
      setSaleProduct(null);
      setSaleQty("1");
      setSaleBuyer("");
    } catch {
      toast.error("Couldn't record the sale. Please try again.");
    } finally {
      setRecording(false);
    }
  }

  const saleTotal = saleProduct
    ? (Math.floor(Number(saleQty)) || 0) * saleProduct.price
    : 0;

  return (
    <AppShell
      active="sell"
      title="Sell products"
      subtitle="List what your nursery sells, keep stock up to date and record sales."
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Listings" value={String(listingCount)} />
          <StatCard label="Units in stock" value={totalStock.toLocaleString()} />
          <StatCard
            label="Catalogue value"
            value={`₹${catalogueValue.toLocaleString()}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
            Your listings
          </h2>
          <Button className="h-11 rounded-xl px-5 font-semibold" onClick={openNew}>
            <Plus className="size-4" />
            Add product
          </Button>
        </div>

        {products === undefined ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Flower2 className="size-6" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                No products listed yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Add the plants, saplings or seedlings you sell so buyers can see
                what your nursery offers.
              </p>
            </div>
            <Button className="h-11 rounded-xl px-5" onClick={openNew}>
              <Plus className="size-4" />
              Add your first product
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)]"
              >
                <div className="relative aspect-[4/3] bg-surface-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-7" />
                    </span>
                  )}
                  <Badge
                    className={cn(
                      "absolute left-3 top-3 h-6 border-transparent px-2 text-[11px]",
                      product.stock > 0
                        ? "bg-success-bg text-success"
                        : "bg-danger-bg text-danger",
                    )}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center text-sm font-bold text-primary">
                      <IndianRupee className="size-3.5" />
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {product.unit}
                  </p>
                  {product.description ? (
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  ) : (
                    <span className="flex-1" />
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      className="h-10 flex-1 rounded-xl font-semibold"
                      disabled={product.stock <= 0}
                      onClick={() => {
                        setSaleProduct(product);
                        setSaleQty("1");
                        setSaleBuyer("");
                      }}
                    >
                      <ShoppingCart className="size-4" />
                      Record sale
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-10 rounded-xl"
                      aria-label="Edit listing"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteProduct
                      onDelete={() => void removeProduct({ id: product._id })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / edit product */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setFile(null);
            setPreview(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit listing" : "Add a product"}</DialogTitle>
            <DialogDescription>
              Buyers will see this in your nursery catalogue.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
                preview
                  ? "border-transparent"
                  : "border-border bg-surface-2 hover:border-primary/40",
              )}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Product preview"
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-7" />
                  <span className="text-sm font-medium">Add a photo</span>
                </span>
              )}
            </button>

            <div className="flex flex-col gap-2">
              <Label htmlFor="p-name" className="text-sm font-medium">
                Product name <span className="text-danger">*</span>
              </Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alphonso mango sapling"
                className="h-11 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Category <span className="text-danger">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl text-sm">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_NURSERY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="p-price" className="text-sm font-medium">
                  Price (₹) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="p-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="p-stock" className="text-sm font-medium">
                  Quantity available
                </Label>
                <Input
                  id="p-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Sold by</Label>
              <Select
                value={form.unit}
                onValueChange={(value) => setForm({ ...form, unit: value })}
              >
                <SelectTrigger className="h-11 w-full rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="p-desc" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Variety, size, growing notes…"
                rows={3}
                maxLength={500}
                className="resize-none rounded-xl text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setFormOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={save}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "List product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record sale */}
      <Dialog
        open={saleProduct !== null}
        onOpenChange={(open) => {
          if (!open) setSaleProduct(null);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record a sale</DialogTitle>
            <DialogDescription>
              {saleProduct
                ? `${saleProduct.name} · ${saleProduct.stock} in stock`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-qty" className="text-sm font-medium">
                Quantity sold
              </Label>
              <Input
                id="s-qty"
                type="number"
                min={1}
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-buyer" className="text-sm font-medium">
                Buyer <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="s-buyer"
                value={saleBuyer}
                onChange={(e) => setSaleBuyer(e.target.value)}
                placeholder="e.g. Green Park Landscapes"
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3">
              <span className="text-sm font-medium text-accent-foreground">
                Sale total
              </span>
              <span className="flex items-center text-lg font-bold text-accent-foreground">
                <IndianRupee className="size-4" />
                {saleTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setSaleProduct(null)}
              disabled={recording}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={recordSale}
              disabled={recording}
            >
              {recording ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Recording…
                </>
              ) : (
                "Record sale"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-[-0.01em] text-foreground">
        {value}
      </p>
    </div>
  );
}

function DeleteProduct({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="size-10 rounded-xl text-danger hover:text-danger"
          aria-label="Delete listing"
        >
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the product from your catalogue. Recorded sales stay.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-11 rounded-xl bg-danger text-white hover:bg-[#B71C1C]"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
