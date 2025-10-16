import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { MultiSelect } from 'primereact/multiselect';
import Swal from "sweetalert2"; //npm install sweetalert2
import * as XLSX from 'xlsx'; //npm install xlsx

const DynamicDatatable = ({ isDetailPage = false }) => {
	const theme = useSelector((state) => state.theme.mode);
	const dt = useRef(null);
	const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
	const [product, setProduct] = useState(null);
	const [selectedProducts, setSelectedProducts] = useState([]);
	useEffect(() => {
    console.log('Theme changed to:', theme);
	}, [theme]);

	const [products, setProducts] = useState([
		{ id: 1, code: 'P-0001', name: 'Product 1', category: 'Test Category', quantity: 1 },
		{ id: 2, code: 'P-0002', name: 'Product 2', category: 'Test Category', quantity: 3 },
		{ id: 3, code: 'P-0003', name: 'Product 3', category: 'Test Category', quantity: 8 },
		{ id: 4, code: 'P-0004', name: 'Product 4', category: 'Test Category', quantity: 15 },
		{ id: 5, code: 'P-0005', name: 'Product 5', category: 'Test Category', quantity: 17 },
		{ id: 6, code: 'P-0006', name: 'Product 6', category: 'Test Category', quantity: 19 },
	]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		code: { value: null, matchMode: FilterMatchMode.CONTAINS },
		name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]  },
		category: { value: null, matchMode: FilterMatchMode.CONTAINS },
		quantity: { value: null, matchMode: FilterMatchMode.EQUALS },
	});
	const [globalFilterValue, setGlobalFilterValue] = useState('');


	const [columns,setColumns] = useState([
		{ field: 'code', header: 'Code', sortable: true, className:theme === 'dark' ? 'text-white' : 'text-gray-800' },
		{ field: 'name', header: 'Name', sortable: true, className:theme === 'dark' ? 'text-white' : 'text-gray-800' },
		{ field: 'category', header: 'Category', sortable: true, className:theme === 'dark' ? 'text-white' : 'text-gray-800' },
		{ field: 'quantity', header: 'Quantity', sortable: true, className:theme === 'dark' ? 'text-white' : 'text-gray-800' },
	]);


	const clearFilter = () => {
		initFilters();
	};

	const initFilters = () => {
		setFilters({
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			code: { value: null, matchMode: FilterMatchMode.CONTAINS },
			name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
			category: { value: null, matchMode: FilterMatchMode.CONTAINS },
			quantity: { value: null, matchMode: FilterMatchMode.EQUALS },
		});
		setGlobalFilterValue('');
	};

	const onGlobalFilterChange = (e) => {
		const value = e.target.value;
		let _filters = { ...filters };
		_filters['global'].value = value;
		setFilters(_filters);
		setGlobalFilterValue(value);
	};

	const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      Swal.fire({
        title: 'Error!',
        text: 'No file selected.',
        icon: 'error',
        theme: theme === 'dark' ? 'dark' : 'light',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (parsedData.length < 1) {
          Swal.fire({
            title: 'Error!',
            text: 'Excel file is empty.',
            icon: 'error',
            theme: theme === 'dark' ? 'dark' : 'light',
          });
          return;
        }

        const headers = parsedData[0];
        if (!headers || headers.length === 0) {
          Swal.fire({
            title: 'Error!',
            text: 'No headers found in the Excel file.',
            icon: 'error',
            theme: theme === 'dark' ? 'dark' : 'light',
          });
          return;
        }

        // Generate new products with unique IDs
        const newProducts = parsedData.slice(1).map((row, index) => {
          const item = { id: Date.now() + index }; // Unique ID
          headers.forEach((header, i) => {
            item[header] = row[i] !== undefined ? row[i] : '';
          });
          return item;
        });

        // Generate new columns based on headers
        const newColumns = headers.map((header) => ({
          field: header,
          header: header.charAt(0).toUpperCase() + header.slice(1), // Capitalize header
          sortable: true,
          className: theme === 'dark' ? 'text-white' : 'text-gray-800',
        }));

        console.log('Parsed Excel data:', newProducts);
        console.log('New columns:', newColumns);

        setProducts(newProducts);
        setColumns(newColumns);

        // Update filters for new columns
        const newFilters = {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        };
        headers.forEach((header) => {
          newFilters[header] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        });
        setFilters(newFilters);

        Swal.fire({
          title: 'Success!',
          text: 'Excel data loaded successfully.',
          icon: 'success',
          theme: theme === 'dark' ? 'dark' : 'light',
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to parse Excel file.',
          icon: 'error',
          theme: theme === 'dark' ? 'dark' : 'light',
        });
      }
    };
    reader.onerror = () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to read Excel file.',
        icon: 'error',
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    };
    reader.readAsBinaryString(file);
  	};

	const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));
		const exportCSV = (selectionOnly) => {
		dt.current.exportCSV({ selectionOnly });
    };


    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'products');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
	const renderHeader = () => {
	return (
		<React.Fragment>
			<div className="mb-6 flex items-center gap-4">
				<label className={`font-medium ${theme === 'dark' ? 'text-gray-100':'text-gray-700'}`}>Insert Excel File:</label>
				<input type="file" accept=".xls,.xlsx" onChange={handleExcelUpload} className={` ${theme==='dark'?'!bg-gray-800 !border-none text-white p-3':'bg-gray-100 p-3'} rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500`}/>
			</div>
			<div className={`flex justify-between items-center p-2 mb-3 ${theme === 'dark' ? 'text-white ' : ' text-gray-800 '}`}>
				<h2 className={`text-lg font-bold ${isDetailPage ? 'text-2xl' : 'text-base'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
					Data Table
				</h2>
			{isDetailPage && (
				<div className="flex justify-content-between ">
					<Button type="button" icon="pi pi-plus" severity="success" rounded onClick={createNewProduct} data-pr-tooltip="Create" title='Create Record' className='!mr-2' />
					<Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} className={`mr-2 ${theme==='dark'?'!border-none !text-white !bg-gray-800':' !border-gray-300 !text-gray-600'}`} />
					<IconField iconPosition="left" className='ml-3'>
						<InputIcon className={`pi pi-search `} />
						<InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" className={`${theme==='dark'?'!bg-gray-800 !border-none':'bg-white'}`} />
					</IconField>
					<div className="flex align-items-center justify-content-end gap-2 mr-2 ml-2">
						<Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" title='Download CSV' />
						<Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" title='Download Excel' />
					</div>
				</div>
			)}
			</div>
		</React.Fragment>
	);
	};

	const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button size='5' icon="pi pi-pencil" rounded outlined className="!mr-3" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };
	const createNewProduct = async () => {
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const hasCode = columns.some((col) => col.field === 'code');
    const productCode = hasCode ? `P-${String(newId).padStart(4, '0')}` : '';

    const { value: newProduct } = await Swal.fire({
      title: 'New Record',
      theme: theme === 'dark' ? 'dark' : 'light',
      confirmButtonText: 'Save',
      html: `
        <div style="text-align: left; margin-bottom: 10px;">
          ${columns
            .map((col, index) => {
              const isCode = col.field === 'code';
              const inputType = col.field === 'quantity' ? 'number' : 'text';
              const value = isCode ? productCode : '';
              return `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <label for="swal-input${index}" class="swal2-label" style="width: 120px; font-weight: 500;">${col.header}</label>
                  <input
                    id="swal-input${index}"
                    type="${inputType}"
                    class="swal2-input${isCode ? ' bg-gray-300' : ''}"
                    value="${value}"
                    style="flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;"
                    ${isCode ? 'disabled' : 'required'}
                  >
                </div>
              `;
            })
            .join('')}
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const result = { id: newId };
        let isValid = true;
        columns.forEach((col, index) => {
          const value = document.getElementById(`swal-input${index}`).value;
          if (!value && col.field !== 'code') {
            isValid = false;
            Swal.showValidationMessage(`${col.header} is required`);
          }
          result[col.field] = col.field === 'quantity' ? parseInt(value, 10) || 0 : value;
        });
        return isValid ? result : null;
      },
    });

    if (newProduct) {
      console.log('New product:', newProduct);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      Swal.fire({
        title: 'Success!',
        text: 'Record created successfully.',
        icon: 'success',
        theme: theme === 'dark' ? 'dark' : 'light',
      });
    }
  	};


	const editProduct = async (product) => {
	const { value: updatedProduct } = await Swal.fire({
		title: 'Edit Record',
		theme: theme === 'dark' ? 'dark' : 'light',
		confirmButtonText: 'Save',
		html: `
		<div style="text-align: left; margin-bottom: 10px;">
			${columns
			.map((col, index) => {
				const isCode = col.field === 'code';
				const inputType = col.field === 'quantity' ? 'number' : 'text';
				const value = product[col.field] !== undefined ? product[col.field] : '';
				return `
				<div style="display: flex; align-items: center; margin-bottom: 10px;">
					<label for="swal-input${index}" class="swal2-label" style="width: 120px; font-weight: 500;">${col.header}</label>
					<input
					id="swal-input${index}"
					type="${inputType}"
					class="swal2-input${isCode ? ' bg-gray-300' : ''}"
					value="${value}"
					style="flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px;"
					${isCode ? 'disabled' : 'required'}
					>
				</div>
				`;
			})
			.join('')}
		</div>
		`,
		focusConfirm: false,
		preConfirm: () => {
		const result = { id: product.id };
		let isValid = true;
		columns.forEach((col, index) => {
			const value = document.getElementById(`swal-input${index}`).value;
			if (!value && col.field !== 'code') {
			isValid = false;
			Swal.showValidationMessage(`${col.header} is required`);
			}
			result[col.field] = col.field === 'quantity' ? parseInt(value, 10) || 0 : value;
		});
		return isValid ? result : null;
		},
	});

	if (updatedProduct) {
		console.log('Updated product:', updatedProduct);
		setProducts((prevProducts) =>
		prevProducts.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
		);
		Swal.fire({
		title: 'Success!',
		text: 'Record updated successfully.',
		icon: 'success',
		theme: theme === 'dark' ? 'dark' : 'light',
		});
	}
	};

	const confirmDeleteProduct = (product) => {
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		theme: theme === 'dark' ? 'dark' : 'light',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!',
	}).then((result) => {
		if (result.isConfirmed) {
		setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
		console.log('Deleted product ID:', product.id);
		Swal.fire({
			title: 'Deleted!',
			text: 'Your Record has been deleted.',
			icon: 'success',
			theme: theme === 'dark' ? 'dark' : 'light',
		});
		}
	});
	};

	return (
	<div
		className={`container mx-auto rounded-lg shadow-sm ${
		isDetailPage
			? theme === 'dark'
			? 'bg-gradient-to-br from-gray-900 to-gray-800 p-4 min-h-[600px]'
			: 'bg-white p-4 min-h-[600px]'
			: theme === 'dark'
			? 'bg-gradient-to-br from-gray-900 to-gray-800 p-4 h-48 overflow-hidden'
			: 'bg-gray-100 p-2 h-48 overflow-hidden'
		}`}
	>	
		{isDetailPage && (renderHeader())}
		<DataTable
			value={products}
			showGridlines 
			ref={dt}
			paginator={isDetailPage}
			rows={isDetailPage ? 5 : 2}
			selectionMode="checkbox"
			selection={selectedProducts} 
			onSelectionChange={(e) => setSelectedProducts(e.value)}
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
			currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
			rowsPerPageOptions={isDetailPage ? [5, 10, 25, 50] : []}
			globalFilterFields={['code', 'name', 'category', 'quantity']}
			filters={filters}
			onFilter={(e) => setFilters(e.filters)}
			resizableColumns 
			// header={isDetailPage &&(renderHeader())}
			// headerClassName={theme === 'dark' ? 'bg-gray-900 !text-white' : 'text-gray-900 bg-white'}
			className={`min-w-full ${isDetailPage ? '' : 'text-xs'} ${theme === 'dark' ? 'text-white !bg-transparent !border-none' : 'text-gray-800'}`}
			tableStyle={{ fontSize: isDetailPage ? '14px' : '12px',border:'none',backgroundColor:theme==='dark'?'#1E293B':'white' }}
			paginatorClassName={isDetailPage ? theme==='dark'?'!bg-gray-800 !text-white !border-gray-900':'' : 'text-xs'}
			emptyMessage="No products found."
			aria-label="Dynamic Data Table"
			key={`datatable-${theme}`} 
		>
		{isDetailPage && (<Column selectionMode="multiple" headerStyle={{ width: '3rem' }} className={theme === 'dark' ? 'text-white bg-gray-700  !border-gray-900' : 'text-gray-800 '} headerClassName={theme === 'dark' ? '!bg-gray-800 !text-white !border-gray-900' : 'text-gray-900 bg-white'}></Column>
		)}
		{columns.map((col) => (
			<Column
				key={`${col.field}-${theme}`} 
				field={col.field}
				filter = {isDetailPage} 
				filterField={col.field}
				header={col.header}
				headerClassName={theme === 'dark' ? '!bg-gray-800 !text-white !border-gray-900' : 'text-gray-900 bg-white'}
				sortable={isDetailPage && col.sortable}
				className={theme === 'dark' ? 'text-white bg-gray-700  !border-gray-900' : 'text-gray-800 '}
			/>
		))}
		{isDetailPage &&(<Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '7rem' }} className={theme === 'dark' ? 'text-white bg-gray-700  !border-gray-900' : 'text-gray-800 '} headerClassName={theme === 'dark' ? '!bg-gray-800 !text-white !border-gray-900' : 'text-gray-900 bg-white'}></Column>
)}
		</DataTable>

	</div>
	);
};

export default DynamicDatatable;