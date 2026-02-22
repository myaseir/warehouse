"use client";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown, PackagePlus, Loader2 } from 'lucide-react';

interface Product {
  id?: number | string | null;
  name: string;
}

interface ProductSearchProps {
  selected: Product | null;
  setSelected: Dispatch<SetStateAction<Product | null>>;
}

export default function ProductSearch({ selected, setSelected }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real products from your FastAPI backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Ensure data is an array before setting state
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading products for search:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on user input
  const filteredProducts =
    query === ''
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Combobox.Input
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none"
              displayValue={(product: Product) => product?.name || ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={loading ? "Loading products..." : "Search or add product..."}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : (
                <ChevronsUpDown className="h-5 w-5 text-gray-400" />
              )}
            </Combobox.Button>
          </div>
          
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {/* "Add New" option if no match is found */}
            {filteredProducts.length === 0 && query !== '' && !loading && (
              <Combobox.Option
                value={{ id: null, name: query }}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <PackagePlus size={16} /> Add new: "{query}"
                </span>
              </Combobox.Option>
            )}

            {filteredProducts.map((product) => (
              <Combobox.Option
                key={product.id || product.name}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`
                }
                value={product}
              >
                {({ selected: isSelected, active }) => (
                  <>
                    <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                      {product.name}
                    </span>
                    {isSelected ? (
                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'}`}>
                        <Check className="h-5 w-5" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}