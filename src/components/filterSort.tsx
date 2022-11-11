import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { View } from "react-native";
import DropDownPicker, { ThemeNameType } from 'react-native-dropdown-picker';
import { useRecoilState } from "recoil";
import { brightnessMode } from "../states/brightnessMode";
import { wHeight } from "../utils/Utils";

// dropdown for sorting by year
const filterSort = (props: { onChangeFilter: (arg0: string) => void; onChangeSort: (arg0: string) => void; }) => {

    const [mode, setMode] = useRecoilState(brightnessMode);
    const [openSort, setOpenSort] = useState(false);
    const [valueSort, setValueSort] = useState("-1");
    const [itemsSort, setItemsSort] = useState([
      {label: 'Newest first', value: '-1'},
      {label: 'Oldest first', value: '1'}
    ]);

    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState("All");
    const [itemsFilter, setItemsFilter] = useState([
      {label: 'All', value: "All"},
      {label: 'Action', value: "Action"},
      {label: 'Adult', value: "Adult"},
      {label: 'Adventure', value: "Adventure"},
      {label: 'Animation', value: "Animation"},
      {label: 'Biography', value: "Biography"},
      {label: 'Comedy', value: "Comedy"},
      {label: 'Crime', value: "Crime"},
      {label: 'Documentary', value: "Documentary"},
      {label: 'Drama', value: "Drama"},
      {label: 'Family', value: "Family"},
      {label: 'Fantasy', value: "Fantasy"},
      {label: 'Film-Noir', value: "Film-Noir"},
      {label: 'History', value: "History"},
      {label: 'Horror', value: "Horror"},
      {label: 'Musical', value: "Musical"},
      {label: 'Music', value: "Music"},
      {label: 'Mystery', value: "Mystery"},
      {label: 'Romance', value: "Romance"},
      {label: 'Sci-Fi', value: "Sci-Fi"},
      {label: 'Short', value: "Short"},
      {label: 'Sport', value: "Sport"},
      {label: 'Talk-Show', value: "Talk-Show"},
      {label: 'Thriller', value: "Thriller"},
      {label: 'War', value: "War"},
      {label: 'Western', value: "Western"},
    ]);

    useEffect(() => {
        props.onChangeFilter(valueFilter);
    }, [valueFilter]);

    useEffect(() => {
        props.onChangeSort(valueSort);
    }, [valueSort]);

    const onOpenSort = useCallback(() => {
        setOpenFilter(false);
    }, []);
    
    const onFilterSort = useCallback(() => {
    setOpenSort(false);
    }, []);

    const [theme, setTheme] = useState<ThemeNameType | undefined>("DARK");
    
    useEffect(() => {
        if(mode.dropDownColor === "#2A2D3E") {
            setTheme("DARK");
        }
        else {
            setTheme("LIGHT");
        }
    })

    return (
        <View style={{display: "flex", flexDirection: "row"}}>
            <View style={{flex: 1}}>
                <DropDownPicker
                    style={{
                        backgroundColor: mode.dropDownColor, 
                        borderTopRightRadius: 0, 
                        borderTopLeftRadius: 0, 
                        borderWidth: wHeight(0.5),
                        borderRightWidth: wHeight(0.25),
                        borderRadius: 0,
                        borderColor: mode.navbarColor
                    }}
                    theme={theme}
                    open={openFilter}
                    onOpen={onFilterSort}
                    value={valueFilter}
                    items={itemsFilter}
                    setOpen={setOpenFilter}
                    setValue={setValueFilter}
                    setItems={setItemsFilter}
                />
            </View>

            <View style={{flex: 1}}>
                <DropDownPicker
                    style={{
                        backgroundColor: mode.dropDownColor, 
                        borderTopRightRadius: 0, 
                        borderTopLeftRadius: 0, 
                        borderWidth: wHeight(0.5),
                        borderLeftWidth: wHeight(0.25),
                        borderRadius: 0,
                        borderColor: mode.navbarColor
                    }}
                    theme={theme}
                    open={openSort}
                    onOpen={onOpenSort}
                    value={valueSort}
                    items={itemsSort}
                    setOpen={setOpenSort}
                    setValue={setValueSort}
                    setItems={setItemsSort}
                />
            </View>
        </View>
    )
}

export default filterSort;