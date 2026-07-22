package com.tinasheGomo.MonishaEcomBackend.mapper.wishlist;

import com.tinasheGomo.MonishaEcomBackend.dto.wishlist.response.WishlistResponseDTO;
import com.tinasheGomo.MonishaEcomBackend.entity.wishlist.WishlistEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistMapper {

    WishlistResponseDTO toResponse(WishlistEntity entity);

    List<WishlistResponseDTO> toResponseList(List<WishlistEntity> entities);
}
