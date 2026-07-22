package com.tinasheGomo.MonishaEcomBackend.mapper.cart;

import com.tinasheGomo.MonishaEcomBackend.dto.cart.response.CartItemResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.cart.CartItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "lineTotal", ignore = true)
    CartItemResponseDTO toCartItemDTO(CartItemEntity item);

    List<CartItemResponseDTO> toCartItemDTOList(List<CartItemEntity> items);
}
