#

## 动态条件查询

```java
public interface 某某Repository extends JpaRepository<某某Entity, Number>, JpaSpecificationExecutor<某某Entity> {

}

使用 Specification 动态生成条件查询
```java
@Autowired
某某Repository 某某LogRepository;

public void 根据某某条件获取某某Entity(){
  Specification<某某Entity> specification=new Specification<某某Entity>(){
      //通过实现toPredicate方法来动态查询
      @Override
      public Predicate toPredicate(Root<UserLogEntity> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

      }
  }
}

```
