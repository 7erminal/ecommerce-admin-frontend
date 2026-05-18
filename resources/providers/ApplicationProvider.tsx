

import React, { type ReactNode, useState } from 'react';
import ApplicationContext from './ApplicationContext';
// @ts-ignore
import Api from './../apis';
import type { Category, Language, Video } from '../types/applicationTypes';


export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Array<Video>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [languages, setLanguages] = useState<Array<Language>>([]);

  const [activeMenuItem, setActiveMenuItem] = useState<string>('home');

    const clearAll = () => {
        
    }

    const setActiveMenu = (menuItem: string) => {
      setActiveMenuItem(menuItem);
    }

    const getCourses = async (languageId: string | null | undefined = null, categoryId: string | null | undefined = null) => {
      // setLoading(true);
      try {
            console.log("Fetching videos...");

            let url = '/api/portal/videos/';
            const params = new URLSearchParams();
            
            if (languageId) params.append('language', languageId);
            if (categoryId) params.append('category', categoryId);
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            const response = await new Api().GET_(url);
            console.log("Fetched videos: ", response);
            // setLoading(false);
            // Handle the fetched categories (e.g., set state)
            if(response.status==200){
                if(response.data.StatusCode == 200){
                    console.log("Videos fetched successfully.");

                    const videos_ = response.data.Result;
                    console.log("Videos data: ", videos_);
                    setCourses(videos_);
                }
            }
        } catch (error) {
            console.error("Error fetching videos: ", error);
        }
    }

    const fetchCategories = async () => {
        try {
            console.log("Fetching categories...");
            const response = await new Api().GET_('/api/portal/categories/');
            console.log("Fetched categories: ", response);
            // Handle the fetched categories (e.g., set state)
            if(response.status==200){
                if(response.data.StatusCode == 200){
                    console.log("Categories fetched successfully.");

                    const categories_ = response.data.Result;
                    console.log("Categories data: ", categories_);
                    setCategories(categories_);
                }
            }
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    }

    const fetchLanguages = async () => {
        try {
            console.log("Fetching languages...");
            const response = await new Api().GET_('/api/portal/languages/');
            console.log("Fetched languages: ", response);
            // Handle the fetched categories (e.g., set state)
            if(response.status==200){
                if(response.data.StatusCode == 200){
                    console.log("Languages fetched successfully.");

                    const languages_ = response.data.Result;
                    console.log("Languages data: ", languages_);
                    setLanguages(languages_);
                }
            }
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    }

    return (
        <ApplicationContext.Provider value={
          { 
            clearAll, 
            loading,
            setLoading,
            courses,
            
            activeMenuItem,
            setActiveMenu,

            categories,
            languages,
            getCourses,
            fetchCategories,
            fetchLanguages
          }}>
          {children}
        </ApplicationContext.Provider>
      );
}