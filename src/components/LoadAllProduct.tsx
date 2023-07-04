import { getAllProducts } from '@/api/api_function'
import { getallproduct } from '@/redux/reducers/allProduct_reducers';
import { RootState } from '@/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { mainApi } from '@/api/main_api';
import * as apiEndpoints from '@/api/api_endpoints';
import { useEffect } from 'react';

interface IAllProduct {
    allProduct: any[];
  }

const LoadAllProduct = () => {
    const dispatch = useDispatch();
    const allProducts = useSelector((state: RootState) => state.all.allProduct);

    const getCategorySlug = async (categoryId: string) => {
        try {
          const result = await mainApi.get(apiEndpoints.GET_CATEGORIES_BY_ID(categoryId));
          const data = result.data.data.categorySlug;
          return data;
        } catch (error: any) {
          return error;
        }
      };

    const getProductImageURLs = async (productId: string) => {
        try {
          const result = await mainApi.get(apiEndpoints.GET_PRODUCT_IMAGES_URL(productId));
          const data = result.data.data;
          // console.log('image', data);
          return data;
        } catch (error: any) {
          return error;
        }
      };

    const getAllProducts = async () => {
        try {
            const result = await mainApi.get(apiEndpoints.GET_ALL_PRODUCTS);
            const data = result.data.data;
            const productPromises = data.map(async (item: any) => {
            if (item.productStatus === true) {
              const categorySlugPromise = getCategorySlug(item.productCategoryId);
              const categorySlug = await categorySlugPromise;
              const imageUrlsPromise = getProductImageURLs(item._id);
              const imageUrls = await imageUrlsPromise;
              const imageURLs = imageUrls.map((image: any) => image.imageURL);
              return {
                id: item._id,
                discount_id: item.productDiscountId,
                category_id: item.productCategoryId,
                category_slug: categorySlug,
                name: item.productName,
                description: item.productDescription,
                price: item.productPrice,
                images: imageURLs,
                create_at: item.createdAt,
                update_at: item.updatedAt,
                sold: item.productSold,
              };
            }
          });
          const resolvedProducts = await Promise.all(productPromises);
          // dispatch(getallproduct(resolvedProducts.filter((product) => product !== undefined)));
          const allProducts: IAllProduct = {
            allProduct: resolvedProducts.filter((product) => product !== undefined),
          };
          dispatch(getallproduct(allProducts));
        } catch (error: any) {
          console.log(error);
        }
      };

    useEffect(() => {
        getAllProducts();
    }, [])

    return (
        <>
            
        </>
    )
}

export default LoadAllProduct